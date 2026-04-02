cleanup_report_artifacts() {
  if [[ $KEEP_ARTIFACTS -eq 1 ]]; then
    return
  fi

  if [[ $REPORT -eq 1 && -n "${REPORT_FILE:-}" ]]; then
    find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' ! -path "$REPORT_FILE" -delete 2>/dev/null || true
  else
    find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' -delete 2>/dev/null || true
  fi
}

cleanup_ios_test_artifacts() {
  if [[ $KEEP_ARTIFACTS -eq 1 || $FAST_MODE -eq 1 ]]; then
    return
  fi

  rm -rf "$IOS_DERIVED_DATA/Logs/Test" 2>/dev/null || true
  rm -rf "$IOS_DERIVED_DATA/Logs/TestSummary" 2>/dev/null || true
}

cleanup_local_and_exit() {
  ensure_tool_output_dirs
  rm -rf ./ios/build/Logs/Test 2>/dev/null || true
  rm -rf ./ios/build/Logs/TestSummary 2>/dev/null || true
  rm -rf ./android/build 2>/dev/null || true
  rm -rf ./demo/android/app/build 2>/dev/null || true
  find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' -delete 2>/dev/null || true
  find ./logs -maxdepth 1 -type f -delete 2>/dev/null || true
  echo "已清理測試產物"
  echo "- ios/build/Logs/Test"
  echo "- ios/build/Logs/TestSummary"
  echo "- android/build"
  echo "- demo/android/app/build"
  echo "- reports/*.txt"
  echo "- logs/*"
  exit 0
}

cleanup_global_caches_and_exit() {
  rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/* 2>/dev/null || true
  rm -rf "$HOME/Library/Developer/CoreSimulator/Devices"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/caches"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/daemon"/* 2>/dev/null || true
  npm cache clean --force >/dev/null 2>&1 || true
  echo "已清理全域快取"
  echo "- ~/Library/Developer/Xcode/DerivedData/*"
  echo "- ~/Library/Developer/CoreSimulator/Devices/*"
  echo "- ~/.gradle/caches/*"
  echo "- ~/.gradle/daemon/*"
  echo "- npm cache"
  exit 0
}

cleanup_all_and_exit() {
  ensure_tool_output_dirs

  rm -rf ./ios/build/Logs/Test 2>/dev/null || true
  rm -rf ./ios/build/Logs/TestSummary 2>/dev/null || true
  rm -rf ./android/build 2>/dev/null || true
  rm -rf ./demo/android/app/build 2>/dev/null || true
  find ./reports -maxdepth 1 -type f -name 'plugin-report-*.txt' -delete 2>/dev/null || true
  find ./logs -maxdepth 1 -type f -delete 2>/dev/null || true

  rm -rf "$HOME/Library/Developer/Xcode/DerivedData"/* 2>/dev/null || true
  rm -rf "$HOME/Library/Developer/CoreSimulator/Devices"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/caches"/* 2>/dev/null || true
  rm -rf "$HOME/.gradle/daemon"/* 2>/dev/null || true
  npm cache clean --force >/dev/null 2>&1 || true

  echo "已清理全部可清理項目"
  echo "[Repo Artifacts]"
  echo "- ios/build/Logs/Test"
  echo "- ios/build/Logs/TestSummary"
  echo "- android/build"
  echo "- demo/android/app/build"
  echo "- reports/*.txt"
  echo "- logs/*"
  echo "[Global Caches]"
  echo "- ~/Library/Developer/Xcode/DerivedData/*"
  echo "- ~/Library/Developer/CoreSimulator/Devices/*"
  echo "- ~/.gradle/caches/*"
  echo "- ~/.gradle/daemon/*"
  echo "- npm cache"
  exit 0
}
