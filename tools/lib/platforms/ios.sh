# iOS adapter for `captool test`.
# This layer owns simulator/xcodebuild details and may implement fast mode
# differently from other platforms while preserving the shared user-facing intent.
resolve_ios_simulator_id() {
  ensure_command xcrun || return 1

  # 清掉 CoreSimulator 中已失效的裝置紀錄，避免命中殘留 ID
  xcrun simctl delete unavailable >/dev/null 2>&1 || true

  local simulator_id
  simulator_id="$(xcrun simctl list devices available | awk -v name="$IOS_SIMULATOR_NAME" '
    index($0, name " (") {
      if (match($0, /\(([A-F0-9-]+)\)/)) {
        print substr($0, RSTART + 1, RLENGTH - 2)
        exit
      }
    }
  ')"

  if [[ -z "$simulator_id" ]]; then
    log "找不到可用的 iOS Simulator: $IOS_SIMULATOR_NAME，嘗試重建..."
    simulator_id="$(xcrun simctl create "$IOS_SIMULATOR_NAME" "com.apple.CoreSimulator.SimDeviceType.iPhone-17" "com.apple.CoreSimulator.SimRuntime.iOS-26-4" 2>/dev/null || true)"
  fi

  if [[ -n "$simulator_id" && ! -d "$HOME/Library/Developer/CoreSimulator/Devices/$simulator_id" ]]; then
    xcrun simctl delete "$simulator_id" >/dev/null 2>&1 || true
    simulator_id="$(xcrun simctl create "$IOS_SIMULATOR_NAME" "com.apple.CoreSimulator.SimDeviceType.iPhone-17" "com.apple.CoreSimulator.SimRuntime.iOS-26-4" 2>/dev/null || true)"
  fi

  if [[ -z "$simulator_id" ]]; then
    log "無法建立 iOS Simulator: $IOS_SIMULATOR_NAME"
    return 1
  fi

  echo "$simulator_id"
}

boot_ios_simulator_if_needed() {
  ensure_command xcodebuild || return 1
  ensure_command xcrun || return 1

  if [[ -n "$DEVICE" ]]; then
    IOS_ACTIVE_DEVICE="$DEVICE"
    IOS_ACTIVE_DESTINATION="id=$IOS_ACTIVE_DEVICE"
    log "使用指定 iOS device: $IOS_ACTIVE_DEVICE"
  else
    IOS_ACTIVE_DEVICE="$(resolve_ios_simulator_id)" || return 1
    IOS_ACTIVE_DESTINATION="id=$IOS_ACTIVE_DEVICE"
    log "使用預設 iOS Simulator: $IOS_SIMULATOR_NAME ($IOS_ACTIVE_DEVICE)"
  fi

  if xcrun simctl list devices | grep -q "$IOS_ACTIVE_DEVICE (Booted)"; then
    log "iOS Simulator 已啟動，直接重用。"
    return 0
  fi

  log "將由 xcodebuild 啟動 iOS Simulator..."
  IOS_STARTED_BY_SCRIPT=1
  return 0
}

cleanup_ios_device() {
  if [[ $FAST_MODE -eq 1 ]]; then
    log "iOS 快速模式保留 Simulator 啟動狀態。"
    return
  fi

  if [[ $IOS_STARTED_BY_SCRIPT -eq 1 && $NO_CLOSE -eq 0 && -n "$IOS_ACTIVE_DEVICE" ]]; then
    log "關閉由腳本啟動的 iOS Simulator: $IOS_ACTIVE_DEVICE"
    xcrun simctl shutdown "$IOS_ACTIVE_DEVICE" >/dev/null 2>&1 || true
  fi
}

ios_fast_test_bundle_ready() {
  [[ -f "$IOS_TEST_BUNDLE_PATH" ]]
}

run_ios_fast_tests() {
  if ios_fast_test_bundle_ready; then
    log "偵測到既有 iOS test bundle，改用 test-without-building。"
  else
    log "尚無可重用的 iOS test bundle，先執行 build-for-testing。"
    run_and_capture "iOS" "xcodebuild build-for-testing -scheme \"$IOS_SCHEME\" -destination '$IOS_ACTIVE_DESTINATION' -derivedDataPath \"$IOS_DERIVED_DATA\" $IOS_TEST_ONLY" || return 1
  fi

  log "執行 iOS test-without-building..."
  run_and_capture "iOS" "xcodebuild test-without-building -scheme \"$IOS_SCHEME\" -destination '$IOS_ACTIVE_DESTINATION' -derivedDataPath \"$IOS_DERIVED_DATA\" $IOS_TEST_ONLY"
}

run_ios_tests() {
  log "=============================="
  log "Step: iOS 測試"
  log "=============================="

  ensure_command bash || return 1
  ensure_command xcodebuild || return 1

  boot_ios_simulator_if_needed || return 1

  if [[ $FAST_MODE -eq 1 ]]; then
    log "使用 iOS 快速模式：保留 derived data，並重用已啟動的 Simulator。"
    CURRENT_PLATFORM_SUMMARY="$(append_unique_line "$CURRENT_PLATFORM_SUMMARY" "iOS fast mode enabled")"
  fi

  cleanup_ios_test_artifacts

  local status=0
  if [[ $FAST_MODE -eq 1 ]]; then
    run_ios_fast_tests
    status=$?
  else
    log "執行 iOS 原生 contract 驗證..."
    run_and_capture "iOS" "xcodebuild test -scheme \"$IOS_SCHEME\" -destination '$IOS_ACTIVE_DESTINATION' -derivedDataPath \"$IOS_DERIVED_DATA\" $IOS_TEST_ONLY"
    status=$?
  fi

  cleanup_ios_device
  return "$status"
}
