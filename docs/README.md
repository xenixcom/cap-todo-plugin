# TodoPlugin Skeleton

這個 repo 是 `TodoPlugin` 的開發骨架，目標是先把單一契約、單一正式測試標準、單一正式測試入口固定下來，再往下實作最小範例與實際平台功能。現在 repo 已經包含官方 Capacitor plugin 結構、三平台實作骨架與 `demo` 展示 app，且 `demo` 三平台已手動驗證可正確運作。

## 核心原則

- App 層只寫一套程式。
- Plugin 對外只提供一套 interface。
- 正式測試標準只有一套 contract test。
- 正式測試工具入口只有一個 `shell script`。
- 平台差異只能存在於 plugin 內部實作，不得演變成各自表述。

## 目前結構

```text
README.md
README.skeleton.md
docs/
  HANDOFF.md
  PORTING_NOTES.md
  PLUGIN_GUIDELINES.md
  README.md
src/
  definitions.ts
  index.ts
  todo.ts
  web.ts
ios/
android/
demo/
scripts/
  test-plugin.sh
tests/
  contract/
    README.md
    options.spec.ts
    lifecycle.spec.ts
    status.spec.ts
    error-handling.spec.ts
    edge-cases.spec.ts
```

## 檔案定位

- [`docs/PLUGIN_GUIDELINES.md`](/Users/james/dev2/cap-todo-plugin/docs/PLUGIN_GUIDELINES.md)
  正式開發與測試原則。
- [`docs/HANDOFF.md`](/Users/james/dev2/cap-todo-plugin/docs/HANDOFF.md)
  完整交接文件，讓另一台電腦可直接接手。
- [`docs/PORTING_NOTES.md`](/Users/james/dev2/cap-todo-plugin/docs/PORTING_NOTES.md)
  未來移植到其他 plugin repo 時的命名與識別字調整清單。
- [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)
  唯一正式測試工具入口。
- [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
  唯一正式測試規格來源。
- [`demo`](/Users/james/dev2/cap-todo-plugin/demo)
  展示與手動驗證環境，目前三平台已手動驗證可運作。

## 測試入口

```bash
./scripts/test-plugin.sh [all|web|ios|android] [--device=ID] [--no-close-device] [--logs=file] [--report]
```

範例：

```bash
./scripts/test-plugin.sh all --logs=plugin_test.log --report
./scripts/test-plugin.sh ios --device=00008030-001D195E3A90002E --no-close-device --report
./scripts/test-plugin.sh web --logs=web_test.log
```

## 下一步

- 討論並定案正式 `src/definitions.ts`。
- 定義唯一正式測試單元與驗收協議。
- 讓 `tests/contract` 從 placeholder 轉成可執行 contract tests。
- 再把 `scripts/test-plugin.sh` 與正式 contract tests 接成閉環。
