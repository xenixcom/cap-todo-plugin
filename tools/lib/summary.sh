initialize_report_file() {
  TIMESTAMP="$(date +"%Y%m%d_%H%M%S")"
  if [[ $REPORT -eq 1 ]]; then
    REPORT_FILE="./reports/plugin-report-${PLATFORM}-${TIMESTAMP}.txt"
    cleanup_report_artifacts
    : > "$REPORT_FILE"
    {
      echo "Capacitor Plugin Test Report"
      echo "Timestamp: $TIMESTAMP"
      echo "Platform: $PLATFORM"
      echo "Device: ${DEVICE:-(auto)}"
      echo
    } >> "$REPORT_FILE"
  fi
}

print_test_header() {
  log "=============================="
  log "Capacitor Plugin 測試"
  log "Platform: $PLATFORM"
  log "Device: ${DEVICE:-(auto)}"
  log "No close device: $NO_CLOSE"
  log "Fast mode: $FAST_MODE"
  if [[ -n "$LOG_FILE" ]]; then
    log "Log file: $LOG_FILE"
  fi
  if [[ $REPORT -eq 1 ]]; then
    log "Report file: $REPORT_FILE"
  fi
  log "=============================="
}

print_test_footer() {
  log "=============================="
  log "測試完成 - 平台: $PLATFORM"
  if [[ "$PLATFORM" == "all" ]]; then
    log "web: $WEB_RESULT"
    log "ios: $IOS_RESULT"
    log "android: $ANDROID_RESULT"
  else
    if [[ -n "$CURRENT_PLATFORM_FAILURE" ]]; then
      log "失敗摘要:"
      while IFS= read -r line; do
        [[ -n "$line" ]] && log "  - $line"
      done <<< "$CURRENT_PLATFORM_FAILURE"
    fi
  fi
  if [[ $REPORT -eq 1 ]]; then
    report_append "=============================="
    report_append "Overall Result"
    if [[ "$PLATFORM" == "all" ]]; then
      report_append "web: $WEB_RESULT"
      report_append "ios: $IOS_RESULT"
      report_append "android: $ANDROID_RESULT"
      report_append "Failed Platforms: $FAILURES"
      if [[ $FAILURES -eq 0 ]]; then
        report_append "Status: PASS"
      else
        report_append "Status: FAIL"
      fi
    else
      local_single_result="PASS"
      if [[ $FAILURES -ne 0 ]]; then
        local_single_result="FAIL"
      fi
      report_append "Status: $local_single_result"
      if [[ -n "$CURRENT_PLATFORM_FAILURE" ]]; then
        report_append "Failure Summary:"
        while IFS= read -r line; do
          [[ -n "$line" ]] && report_append "  - $line"
        done <<< "$CURRENT_PLATFORM_FAILURE"
      fi
    fi
    log "報告檔案: $REPORT_FILE"
  fi
  if [[ "$PLATFORM" == "all" ]]; then
    log "失敗平台數: $FAILURES"
  fi
  if [[ $NO_CLOSE -eq 1 ]]; then
    log "模擬器或裝置將保持開啟。"
  fi
}
