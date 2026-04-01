# Web adapter for `captool test`.
# This layer translates shared test intent into web-specific build/test steps.
run_web_tests() {
  log "=============================="
  log "Step: Web 測試"
  log "=============================="

  ensure_command npm || return 1
  ensure_command bash || return 1

  if [[ $FAST_MODE -eq 1 && "$WEB_FAST_SKIP_BUILD" == "true" ]]; then
    log "使用 Web 快速模式：跳過發佈型 build。"
    CURRENT_PLATFORM_SUMMARY="$(append_unique_line "$CURRENT_PLATFORM_SUMMARY" "Web fast mode enabled")"
  else
    if [[ $FAST_MODE -eq 1 ]]; then
      log "Web 快速模式已要求，但依 config 保留 build 步驟。"
      CURRENT_PLATFORM_SUMMARY="$(append_unique_line "$CURRENT_PLATFORM_SUMMARY" "Web fast mode requested but build retained")"
    fi
    log "編譯 Web Plugin..."
    run_and_capture "Web" "$WEB_BUILD_CMD" || return 1
  fi

  log "執行正式 contract test..."
  run_and_capture "Web" "$CONTRACT_TEST_CMD"
}
