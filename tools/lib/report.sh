resolve_latest_report() {
  find . -maxdepth 1 -type f -name 'plugin-report-*.txt' -print | sort | tail -n 1
}

run_report_and_exit() {
  local report_path=""

  case "${1:-latest}" in
    latest)
      report_path="$(resolve_latest_report)"
      ;;
    *)
      report_path="$1"
      ;;
  esac

  if [[ -z "$report_path" ]]; then
    echo "找不到任何 report 檔案" >&2
    exit 1
  fi

  if [[ ! -f "$report_path" ]]; then
    echo "指定的 report 不存在: $report_path" >&2
    exit 1
  fi

  echo "=============================="
  echo "Captool Report"
  echo "=============================="
  echo "File: $report_path"
  echo "=============================="
  cat "$report_path"
  exit 0
}
