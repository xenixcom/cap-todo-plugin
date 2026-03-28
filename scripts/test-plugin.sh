#!/bin/bash
set -u

# =========================================
# Capacitor Plugin 測試 CLI (v0.5)
# =========================================
# 角色:
#   這支腳本是唯一正式測試工具入口，不是測試標準本身。
#
# 適用範圍:
#   - 原生 API
#   - 權限
#   - 裝置狀態
#   - 原生橋接
#   - 不包含 UI 驗證
#
# 使用方法:
#   ./scripts/test-plugin.sh [all|web|ios|android] [options]
#
# 選項:
#   --device=<ID>        指定 iOS 模擬器或真機 ID
#   --no-close-device    若本次測試由腳本自行開啟裝置，測完後也不要關閉
#   --logs=<filename>    將完整 log 同步輸出到檔案
#   --report             生成簡易 fail report
#
# 說明:
#   這支腳本負責調度平台環境與正式 contract tests，
#   但不綁定特定 JS 測試框架作為正式標準。
# =========================================

PLATFORM="all"
DEVICE=""
NO_CLOSE=0
LOG_FILE=""
REPORT=0
REPORT_FILE=""
FAILURES=0

WEB_BUILD_CMD="npm run build"
CONTRACT_TEST_CMD="${CONTRACT_TEST_CMD:-npm test}"

IOS_SCHEME="${IOS_SCHEME:-XenixCapTodoPlugin}"
IOS_DERIVED_DATA="${IOS_DERIVED_DATA:-./ios/build}"
IOS_SIMULATOR_NAME="${IOS_SIMULATOR_NAME:-iPhone 17}"

ANDROID_GRADLE_CMD="${ANDROID_GRADLE_CMD:-./android/gradlew -p android}"
ANDROID_TEST_CMD="${ANDROID_TEST_CMD:-$ANDROID_GRADLE_CMD test}"

IOS_STARTED_BY_SCRIPT=0
IOS_ACTIVE_DEVICE=""
IOS_ACTIVE_DESTINATION=""

for arg in "$@"; do
  case "$arg" in
    all|web|ios|android) PLATFORM="$arg" ;;
    --device=*) DEVICE="${arg#*=}" ;;
    --no-close-device) NO_CLOSE=1 ;;
    --logs=*) LOG_FILE="${arg#*=}" ;;
    --report) REPORT=1 ;;
    *)
      echo "未知參數: $arg" >&2
      exit 2
      ;;
  esac
done

TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
if [[ $REPORT -eq 1 ]]; then
  REPORT_FILE="plugin-report-${PLATFORM}-${TIMESTAMP}.txt"
  : > "$REPORT_FILE"
fi

log() {
  local message="$1"
  if [[ -n "$LOG_FILE" ]]; then
    echo "$message" | tee -a "$LOG_FILE"
  else
    echo "$message"
  fi
}

report_fail() {
  local message="$1"
  if [[ $REPORT -eq 1 ]]; then
    echo "$message" >> "$REPORT_FILE"
  fi
}

ensure_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    log "缺少必要指令: $command_name"
    return 1
  fi
  return 0
}

run_and_capture() {
  local platform_name="$1"
  local command="$2"
  local temp_output
  local status

  temp_output="$(mktemp)"

  if [[ -n "$LOG_FILE" ]]; then
    bash -lc "$command" 2>&1 | tee -a "$LOG_FILE" | tee "$temp_output"
    status=${PIPESTATUS[0]}
  else
    bash -lc "$command" 2>&1 | tee "$temp_output"
    status=${PIPESTATUS[0]}
  fi

  while IFS= read -r line; do
    case "$line" in
      *FAIL*|*FAILED*|*"Test Failed"*|*"✕"*)
        report_fail "[FAIL] ${platform_name} - ${line}"
        ;;
    esac
  done < "$temp_output"

  rm -f "$temp_output"
  return "$status"
}

boot_ios_simulator_if_needed() {
  ensure_command xcodebuild || return 1

  if [[ -n "$DEVICE" ]]; then
    IOS_ACTIVE_DEVICE="$DEVICE"
    IOS_ACTIVE_DESTINATION="id=$IOS_ACTIVE_DEVICE"
    log "使用指定 iOS device: $IOS_ACTIVE_DEVICE"
    return 0
  fi

  IOS_ACTIVE_DESTINATION="platform=iOS Simulator,name=$IOS_SIMULATOR_NAME"
  log "使用預設 iOS Simulator: $IOS_SIMULATOR_NAME"
  open -a Simulator >/dev/null 2>&1 || true
  IOS_STARTED_BY_SCRIPT=1
  return 0
}

cleanup_ios_device() {
  if [[ $IOS_STARTED_BY_SCRIPT -eq 1 && $NO_CLOSE -eq 0 && -n "$IOS_ACTIVE_DEVICE" ]]; then
    log "關閉由腳本啟動的 iOS Simulator: $IOS_ACTIVE_DEVICE"
    xcrun simctl shutdown "$IOS_ACTIVE_DEVICE" >/dev/null 2>&1 || true
  fi
}

run_web_tests() {
  log "=============================="
  log "Step: Web 測試"
  log "=============================="

  ensure_command npm || return 1
  ensure_command bash || return 1

  log "編譯 Web Plugin..."
  run_and_capture "Web" "$WEB_BUILD_CMD" || return 1

  log "執行正式 contract test..."
  run_and_capture "Web" "$CONTRACT_TEST_CMD"
}

run_ios_tests() {
  log "=============================="
  log "Step: iOS 測試"
  log "=============================="

  ensure_command bash || return 1
  ensure_command xcodebuild || return 1

  boot_ios_simulator_if_needed || return 1

  log "編譯 iOS Plugin..."
  run_and_capture "iOS" "xcodebuild build -scheme \"$IOS_SCHEME\" -destination '$IOS_ACTIVE_DESTINATION' -derivedDataPath \"$IOS_DERIVED_DATA\""
  if [[ $? -ne 0 ]]; then
    cleanup_ios_device
    return 1
  fi

  log "執行 iOS 原生 contract 核心驗證..."
  run_and_capture "iOS" "xcodebuild test -scheme \"$IOS_SCHEME\" -destination '$IOS_ACTIVE_DESTINATION' -derivedDataPath \"$IOS_DERIVED_DATA\""
  local status=$?
  cleanup_ios_device
  return "$status"
}

run_android_tests() {
  log "=============================="
  log "Step: Android 測試"
  log "=============================="

  ensure_command bash || return 1

  log "編譯 Android Plugin..."
  run_and_capture "Android" "$ANDROID_GRADLE_CMD assembleDebug"
  if [[ $? -ne 0 ]]; then
    return 1
  fi

  log "執行 Android 原生 contract 核心驗證..."
  run_and_capture "Android" "$ANDROID_TEST_CMD"
}

run_platform() {
  local platform_label="$1"
  local platform_runner="$2"
  if "$platform_runner"; then
    log "Result: ${platform_label} PASS"
  else
    log "Result: ${platform_label} FAIL"
    FAILURES=$((FAILURES + 1))
  fi
}

log "=============================="
log "Capacitor Plugin 測試"
log "Platform: $PLATFORM"
log "Device: ${DEVICE:-(auto)}"
log "No close device: $NO_CLOSE"
if [[ -n "$LOG_FILE" ]]; then
  log "Log file: $LOG_FILE"
fi
if [[ $REPORT -eq 1 ]]; then
  log "Report file: $REPORT_FILE"
fi
log "=============================="

if [[ "$PLATFORM" == "all" || "$PLATFORM" == "web" ]]; then
  run_platform "Web" run_web_tests
fi

if [[ "$PLATFORM" == "all" || "$PLATFORM" == "ios" ]]; then
  run_platform "iOS" run_ios_tests
fi

if [[ "$PLATFORM" == "all" || "$PLATFORM" == "android" ]]; then
  run_platform "Android" run_android_tests
fi

log "=============================="
log "測試完成 - 平台: $PLATFORM"
if [[ $REPORT -eq 1 ]]; then
  log "報告檔案: $REPORT_FILE"
fi
log "失敗平台數: $FAILURES"
if [[ $NO_CLOSE -eq 1 ]]; then
  log "模擬器或裝置將保持開啟。"
fi

exit "$FAILURES"
