# Android adapter for `captool test`.
# This layer owns gradle/build invocation details and can keep platform-specific
# behavior without changing shared command semantics.
run_android_tests() {
  log "=============================="
  log "Step: Android 測試"
  log "=============================="

  ensure_command bash || return 1

  log "Android test mode: $ANDROID_TEST_MODE"
  CURRENT_PLATFORM_SUMMARY="$(append_unique_line "$CURRENT_PLATFORM_SUMMARY" "Android test mode: $ANDROID_TEST_MODE")"

  log "編譯 Android Plugin..."
  run_and_capture "Android" "$ANDROID_GRADLE_CMD $ANDROID_BUILD_TASK"
  if [[ $? -ne 0 ]]; then
    return 1
  fi

  log "執行 Android 原生 contract 核心驗證..."
  run_and_capture "Android" "$ANDROID_TEST_CMD"
}
