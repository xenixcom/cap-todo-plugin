# Tools

This directory contains repo-local toolchain entrypoints.

It is no longer treated as a loose scripts folder.
It is the beginning of the repo-local `captool` toolchain surface.

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

Boundary:

- `tools/`
  - execution, orchestration, cleanup, reporting, platform-specific tool adapters
- `tests/`
  - formal test definitions and formal contract suites
- `demo/`
  - final UI confirmation and feature showcase, not the formal pipeline host
- `logs/`
  - captool runtime logs
  - execution-oriented output for debugging and trace inspection
- `reports/`
  - captool generated test reports
  - result-oriented summaries for humans and future AI collaboration
- `templates/`
  - reserved for future scaffold/template assets
  - long-term direction for `captool create`

Current internal direction:

- `tools/captool`
  - CLI entrypoint and command dispatch
- `tools/lib/`
  - shared helpers and command-specific internals
  - current first-level split:
    - `common.sh`
    - `cli.sh`
    - `summary.sh`
    - `commands/doctor.sh`
    - `commands/report.sh`
    - `commands/clean.sh`
    - `commands/test.sh`
    - `platforms/web.sh`
    - `platforms/ios.sh`
    - `platforms/android.sh`
  - still evolving; command structure is being stabilized before any deeper subdivision
  - future space is intentionally reserved for:
    - scaffold templates
    - create/init flows
    - command-specific assets

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
  - 將完整 log 同步輸出到 `logs/`
  - 若傳入含路徑值，則照指定路徑輸出
- `--device=<ID>`
  - 指定 iOS simulator 或真機 ID
- `--no-close-device`
  - 若本次測試由腳本啟動 iOS 裝置，測完後不要關閉
- `--keep-artifacts`
  - 保留 report 與測試產物，不自動清理

Report:

- `report`
  - result layer, not raw execution output
  - should stay short, stable, and readable
  - should summarize platform, status, and key failure points
- `log`
  - process layer, not final result summary
  - keeps raw stdout/stderr, build output, and debugging detail
  - may be noisy; intended for deeper troubleshooting
- the exact report format may keep evolving with future test-unit standardization and AI workflow needs
- the boundary should remain stable:
  - `report = result`
  - `log = process`

- `captool report`
  - 顯示最新 report
- `captool report latest`
  - 明確顯示最新 report
- `captool report list`
  - 列出目前 `reports/` 下所有報告
  - 依新到舊排序
  - 顯示 `filename | platform | status`
- `captool report <file>`
  - 顯示指定 report 檔案內容
  - 若只給檔名，會先在 `reports/` 下查找

Clean:

- `captool clean`
  - 預設等同 `captool clean local`
- `captool clean local`
  - 清 repo 內測試產物、reports、logs
- `captool clean global`
  - 清全域 Xcode / Simulator / Gradle / npm 快取
- `captool clean all`
  - 一次清 repo 內產物與全域快取

Doctor:

- `doctor`
  - readiness and self-check layer
  - verifies whether the development environment and captool skeleton are ready
  - should inspect and report, not modify the repo
  - may later surface compatibility or version hints, but should stay conservative
- current doctor focus:
  - toolchain availability
  - repo path readiness
  - output path readiness
  - formal entrypoint presence
- future doctor-related directions may include:
  - `outdated`
  - `update`
  - `upgrade`
  - but those should remain separate commands, not be folded into `doctor`

Direction:

- The next stage is to turn this directory into a clearer toolchain surface rather than keep growing one large script.
- The long-term naming direction for the formal tool is `captool`.
- Expected long-term commands include:
  - `captool test`
  - `captool clean`
  - `captool doctor`
  - `captool report`
  - `captool outdated`
  - `captool update`
  - `captool upgrade`
  - `captool create`
- `captool create` is a future idea for scaffolding a plugin with the contract-first workflow built in, not just generating an empty template.
- future `outdated / update / upgrade` should be designed around two distinct scopes:
  - `scripts`
  - `template`
- those future commands must treat compatibility conservatively, especially for partially customized repos
