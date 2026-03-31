# Tools

This directory contains repo-local toolchain entrypoints.

Current entrypoints:

- `captool`
  - The single formal pipeline entry for plugin verification.
  - It orchestrates `web`, `ios`, and `android` validation.
  - It is a tool entrypoint, not the formal contract standard itself.
  - Current commands:
    - `captool test`
    - `captool clean`
    - `captool doctor`
    - `captool report`
    - `captool help`
- `test-plugin.sh`
  - Legacy compatibility shim.
  - It forwards to `captool` so older commands do not break during migration.

Boundary:

- `tools/`
  - execution, orchestration, cleanup, reporting, platform-specific tool adapters
- `tests/`
  - formal test definitions and formal contract suites
- `demo/`
  - final UI confirmation and feature showcase, not the formal pipeline host

Options:

- `--fast`
  - `captool test web --fast`
  - 跳過 web 發佈型 build，只跑 formal contract tests
  - `captool test ios --fast`
  - 第一次會 `build-for-testing`，之後改走 `test-without-building`
  - 保留 iOS derived data，並重用已啟動的 simulator，適合反覆修錯與重跑
- `--report`
  - 為 test 流程產生摘要報告
- `--logs=<filename>`
  - 將完整 log 同步輸出到檔案
- `--device=<ID>`
  - 指定 iOS simulator 或真機 ID
- `--no-close-device`
  - 若本次測試由腳本啟動 iOS 裝置，測完後不要關閉
- `--keep-artifacts`
  - 保留 report 與測試產物，不自動清理

Report:

- `captool report`
  - 顯示最新 report
- `captool report latest`
  - 明確顯示最新 report
- `captool report <file>`
  - 顯示指定 report 檔案內容

Direction:

- The next stage is to turn this directory into a clearer toolchain surface rather than keep growing one large script.
- The long-term naming direction for the formal tool is `captool`.
- Expected long-term commands include:
  - `captool test`
  - `captool clean`
  - `captool doctor`
  - `captool report`
  - `captool create`
- `captool create` is a future idea for scaffolding a plugin with the contract-first workflow built in, not just generating an empty template.
