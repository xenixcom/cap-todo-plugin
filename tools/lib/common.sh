usage() {
  cat <<'EOF'
Usage:
  ./tools/captool test [all|web|ios|android] [options]
  ./tools/captool clean [artifacts|global-caches]
  ./tools/captool doctor
  ./tools/captool report [latest|<file>]
  ./tools/captool help

Options:
  --device=<ID>          指定 iOS 模擬器或真機 ID
  --no-close-device      若本次測試由腳本自行開啟裝置，測完後也不要關閉
  --fast                 啟用快速模式；Web 會跳過 build，iOS 會重用 simulator 與 derived data
  --keep-artifacts       保留 report 與測試產物，不自動清理
  --logs=<filename>      將完整 log 同步輸出到 logs/ 檔案；若含路徑則照原值
  --report               生成簡易 fail report

Commands:
  test                   執行正式測試流程
  clean artifacts        清除 repo 內測試產物
  clean global-caches    清除全域 Xcode / Simulator / Gradle / npm 快取
  doctor                 檢查本機工具鏈與 repo 關鍵路徑是否可用
  report                 顯示最新或指定的測試報告
  help                   顯示使用說明
EOF
}

log() {
  local message="$1"
  if [[ -n "$LOG_FILE" ]]; then
    echo "$message" | tee -a "$LOG_FILE"
  else
    echo "$message"
  fi
}

report_fail() {
  local message="${1-}"
  if [[ $REPORT -eq 1 ]]; then
    echo "$message" >> "$REPORT_FILE"
  fi
}

report_append() {
  local message="${1-}"
  if [[ $REPORT -eq 1 ]]; then
    echo "$message" >> "$REPORT_FILE"
  fi
}

append_unique_line() {
  local current="${1-}"
  local line="${2-}"
  if [[ -z "$line" ]]; then
    echo "$current"
    return
  fi

  case "$current" in
    *"$line"*)
      echo "$current"
      ;;
    "")
      echo "$line"
      ;;
    *)
      printf "%s\n%s" "$current" "$line"
      ;;
  esac
}

ensure_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    log "缺少必要指令: $command_name"
    return 1
  fi
  return 0
}

ensure_tool_output_dirs() {
  mkdir -p "./logs" "./reports"
}

resolve_log_file_path() {
  local requested_path="$1"
  if [[ -z "$requested_path" ]]; then
    echo ""
    return
  fi

  if [[ "$requested_path" == */* ]]; then
    echo "$requested_path"
  else
    echo "./logs/$requested_path"
  fi
}
