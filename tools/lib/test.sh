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
      *"Test Case "*failed*|*"Testing failed:"*|*"Cannot find "*|*"Missing argument for parameter"*|*"Type '"*|*"Value of type "*|*"The following build commands failed:"*|*"AssertionError:"*|*"Expected"*|*"Received"*|*"error: -["*|*"Execution failed for task"*|*"There were failing tests."*|*"✕"*|"-   "*|"+   "*)
        CURRENT_PLATFORM_FAILURE="$(append_unique_line "$CURRENT_PLATFORM_FAILURE" "$line")"
        ;;
      *FAIL*|*FAILED*|*"Test Failed"*|"  {"|"  }")
        CURRENT_PLATFORM_FAILURE="$(append_unique_line "$CURRENT_PLATFORM_FAILURE" "$line")"
        ;;
      " Test Files "*|"      Tests "*|"** TEST SUCCEEDED **"|BUILD\ SUCCESSFUL*)
        CURRENT_PLATFORM_SUMMARY="$(append_unique_line "$CURRENT_PLATFORM_SUMMARY" "$line")"
        ;;
    esac
  done < "$temp_output"

  rm -f "$temp_output"
  return "$status"
}

run_platform() {
  local platform_label="$1"
  local platform_runner="$2"
  local platform_result_var="$3"
  CURRENT_PLATFORM_SUMMARY=""
  CURRENT_PLATFORM_FAILURE=""

  if "$platform_runner"; then
    printf -v "$platform_result_var" '%s' "PASS"
    log "Result: ${platform_label} PASS"
    if [[ $REPORT -eq 1 ]]; then
      report_append "=============================="
      report_append "Platform: ${platform_label}"
      report_append "Result: PASS"
      if [[ -n "$CURRENT_PLATFORM_SUMMARY" ]]; then
        report_append "Summary:"
        while IFS= read -r line; do
          [[ -n "$line" ]] && report_append "  - $line"
        done <<< "$CURRENT_PLATFORM_SUMMARY"
      else
        report_append "Summary:"
        report_append "  - Command sequence completed successfully"
      fi
      report_append
    fi
  else
    printf -v "$platform_result_var" '%s' "FAIL"
    log "Result: ${platform_label} FAIL"
    FAILURES=$((FAILURES + 1))
    if [[ $REPORT -eq 1 ]]; then
      report_append "=============================="
      report_append "Platform: ${platform_label}"
      report_append "Result: FAIL"
      if [[ -n "$CURRENT_PLATFORM_FAILURE" ]]; then
        report_append "Failure Summary:"
        while IFS= read -r line; do
          [[ -n "$line" ]] && report_append "  - $line"
        done <<< "$CURRENT_PLATFORM_FAILURE"
      else
        report_append "Failure Summary:"
        report_append "  - Command failed without a parsed failure summary. Check console or --logs output."
      fi
      report_append
    fi
  fi
}
