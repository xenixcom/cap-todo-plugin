resolve_latest_report() {
  find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' -print 2>/dev/null | sort | tail -n 1
}

list_reports() {
  find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' -print 2>/dev/null | sort
}

run_report_and_exit() {
  local report_path=""

  case "${1:-latest}" in
    latest)
      report_path="$(resolve_latest_report)"
      ;;
    list)
      echo "=============================="
      echo "Captool Reports"
      echo "=============================="
      if list_reports | grep -q .; then
        list_reports
        exit 0
      else
        echo "找不到任何 report 檔案" >&2
        exit 1
      fi
      ;;
    *)
      if [[ -f "$1" ]]; then
        report_path="$1"
      elif [[ -f "./reports/$1" ]]; then
        report_path="./reports/$1"
      else
        report_path="$1"
      fi
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
