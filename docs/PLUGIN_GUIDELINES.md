# Capacitor Plugin 開發與測試指導原則（V1.0）

## 1. 核心理念

- 單一 interface，多平台實作。
- 所有平台共用同一份 `definitions.ts`，定義 `Options`、`Status`、`Methods`、錯誤契約。
- App 層只呼叫 plugin interface，不處理平台分支。
- 平台差異由各平台 plugin class 吸收；無法支援的功能必須以標準錯誤回傳。

## 2. 責任分界

- App 層：呼叫 interface、接收結果、處理錯誤碼。
- Plugin interface：定義方法、狀態、錯誤契約、行為規範。
- 平台 plugin class：處理原生 API、權限、硬體、生命週期。

## 3. 方法設計原則

- 方法命名清楚，語意明確。
- 行為可預期，狀態必須可追蹤。
- 所有非同步操作統一使用 `Promise` / `async`。
- `Options` 應有明確預設值，並透過 `resolveOptions()` 或等價機制產出最終設定。
- 提供重置或恢復預設值的方法。
- 異常統一 `throw` / `reject`，App 層只依賴錯誤碼，不依賴訊息字串。

建議錯誤碼：

```ts
export type PluginErrorCode =
  | 'UNAVAILABLE'
  | 'UNSUPPORTED_PLATFORM'
  | 'PERMISSION_DENIED'
  | 'INVALID_ARGUMENT'
  | 'INVALID_STATE'
  | 'OPERATION_FAILED';
```

## 4. 跨平台一致性

- 對 App 層來說，plugin 永遠只有一個唯一入口。
- 對 plugin 內部來說，可以有多平台實作，但不得有多套對外標準。
- 不同平台的執行差異由同一個 `shell script` 入口統一調度，但不得形成不同 contract。
- 不支援功能不得沉默失敗，必須明確回傳標準錯誤。

## 5. 測試原則

- 專案只承認一套共用 contract test 作為正式驗收標準。
- `Web`、`iOS`、`Android` 都必須透過同一個 shell script 入口執行，並驗證同一套 contract cases。
- 各平台可自行補充私有測試作為輔助，但不得取代或偏離共用 contract test。
- Fail 時先定位對應平台 plugin class；不得以修改 contract 規避問題。

正式測試至少涵蓋：

- `Options`
- `Lifecycle`
- `Status`
- `ErrorHandling`
- `EdgeCases`

## 6. 推薦目錄結構

```text
src/
  definitions.ts
  index.ts
  web.ts
ios/
android/
tests/
  contract/
    options.spec.ts
    lifecycle.spec.ts
    status.spec.ts
    error-handling.spec.ts
    edge-cases.spec.ts
scripts/
  test-plugin.sh
```

說明：

- `tests/contract/`：唯一正式測試規格來源。
- `scripts/test-plugin.sh`：唯一正式測試工具入口，負責依平台調度同一套 contract test。

## 7. Runner 原則

- `shell script` 是唯一測試工具入口，但不是測試標準本身。
- `shell script` 負責環境檢查、編譯、部署、執行、收集 log、彙整失敗。
- Pass / fail 以 command exit status 為主，log 關鍵字解析只作輔助摘要。
- 各平台不得各自定義正式測試入口或正式驗收標準。

## 8. 維護與擴展

- 新功能必須同步更新下列項目：
- `definitions.ts`
- contract tests
- `web` 實作
- `ios` 實作
- `android` 實作
- CI/CD 應統一呼叫 `scripts/test-plugin.sh` 執行正式 contract test。
- 平台私有測試可保留，但不得成為唯一驗收依據。

## 9. 核心結論

1. App 層呼叫方式不變，跨平台行為一致。
2. 測試 fail 時，優先修正對應平台 plugin class。
3. 只能有一套正式 contract test，不可有三套正式標準。
4. 測試工具入口只有一個 `shell script`，不能有三套正式入口。
5. 方法的異步行為、狀態轉移、錯誤碼、重置能力必須明確。
