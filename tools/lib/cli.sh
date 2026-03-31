parse_command() {
  if [[ $# -gt 0 ]]; then
    case "$1" in
      test|clean|doctor|report|help|-h|--help)
        COMMAND="$1"
        shift
        ;;
    esac
  fi

  REMAINING_ARGS=("$@")
}

dispatch_non_test_commands() {
  case "$COMMAND" in
    help|-h|--help)
      usage
      exit 0
      ;;
    doctor)
      run_doctor_and_exit
      ;;
    report)
      run_report_and_exit "${REMAINING_ARGS[0]:-latest}"
      ;;
  esac

  if [[ "$COMMAND" == "clean" ]]; then
    case "${REMAINING_ARGS[0]:-local}" in
      local)
        cleanup_local_and_exit
        ;;
      global)
        cleanup_global_caches_and_exit
        ;;
      all)
        cleanup_all_and_exit
        ;;
      *)
        echo "未知 clean 目標: ${REMAINING_ARGS[0]:-}" >&2
        usage >&2
        exit 2
        ;;
    esac
  fi
}

parse_test_args() {
  for arg in "${REMAINING_ARGS[@]}"; do
    case "$arg" in
      --clean-artifacts) cleanup_repo_artifacts_and_exit ;;
      --clean-global-caches) cleanup_global_caches_and_exit ;;
      all|web|ios|android) PLATFORM="$arg" ;;
      --device=*) DEVICE="${arg#*=}" ;;
      --no-close-device) NO_CLOSE=1 ;;
      --fast) FAST_MODE=1 ;;
      --keep-artifacts) KEEP_ARTIFACTS=1 ;;
      --logs=*) LOG_FILE="$(resolve_log_file_path "${arg#*=}")" ;;
      --report) REPORT=1 ;;
      *)
        echo "未知參數: $arg" >&2
        exit 2
        ;;
    esac
  done
}
