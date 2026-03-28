# Capacitor Plugin 開發與測試指導原則（V1.1）

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
- `Options` 應有明確預設值，並透過 `getOptions() / setOptions() / resetOptions()` 維持一致行為。
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

## 4. `definitions.ts` 設計準則

- `definitions.ts` 是正式 contract，不是暫時型別集合。
- App 層、測試單元、平台實作都必須以同一份 `definitions.ts` 為準。
- `definitions.ts` 應優先展示可跨平台對齊的正式協議，而不是某個平台的原生細節。
- 設計時應保持小而硬，只保留對外真正需要依賴的欄位與方法。
- 型別名稱、方法名稱、事件名稱、錯誤碼名稱都應穩定且清楚，不應頻繁漂移。
- `definitions.ts` 應使用註解詳細說明方法用途、參數、回傳值、狀態轉移、錯誤行為與事件觸發時機。
- `definitions.ts` 的註解應以協作對齊為目的，不只是型別提示。
- 若某方法有特殊前提、限制、平台映射規則或失敗條件，應直接寫在註解中，不應只留在聊天室或零散文件裡。

`definitions.ts` 至少應明確定義：

- `Options`
- `Status`
- `Methods`
- `Permissions`
- `Events`
- `Error` contract

### 4.1 Options 原則

- `Options` 只應包含會影響 plugin 正式行為的設定，不應混入業務資料模型。
- `getOptions()` 回傳目前生效值。
- `setOptions()` 必須是局部更新；未提供欄位保留原值。
- `resetOptions()` 只重置 options，不改變正式 status。
- `Options` 應有明確預設值。

### 4.2 Status 原則

- `Status` 只表達正式運作狀態，不混入錯誤狀態。
- 錯誤應走正式錯誤契約，不應把 `error` 混入 status。
- 狀態集合應保持最小且可測。
- 狀態轉移規則必須能明確描述並可被 contract test 驗證。
- `getStatus()` 應回傳物件型別而非裸字串，保留未來擴充欄位空間。

### 4.3 Permissions 原則

- App 層只應看到已收斂後的正式權限狀態。
- 平台內部更細的原生權限狀態必須先映射後再對外回傳。
- 不應把平台私有權限語意直接暴露給 App 層。
- `checkPermissions()` 與 `requestPermissions()` 的行為邊界必須清楚分離。

### 4.4 Events 原則

- Event 是正式 contract 的一部分，不是 demo 附屬功能。
- Event 名稱應穩定、語意單一。
- 只有正式狀態或正式資料變化時才應觸發 event。
- Event payload 應使用物件型別，保留未來擴充空間。
- 若目前正式協議只承認單一 event，例如 `statusChange`，文件應明確寫出，不留曖昧空間。

### 4.5 Error 原則

- 所有對外 `throw / reject` 都必須統一成正式錯誤格式。
- App 層只依賴錯誤碼，不依賴訊息字串。
- 平台不支援、權限拒絕、狀態不合法、參數錯誤等情況都必須明確對應正式錯誤碼。
- 不得使用靜默失敗、模糊 `false`、空值等方式取代正式錯誤契約。

## 5. 跨平台一致性

- 對 App 層來說，plugin 永遠只有一個唯一入口。
- 對 plugin 內部來說，可以有多平台實作，但不得有多套對外標準。
- 不同平台的執行差異由同一個 `shell script` 入口統一調度，但不得形成不同 contract。
- 不支援功能不得沉默失敗，必須明確回傳標準錯誤。

## 6. 測試原則

- 專案只承認一套共用 contract test 作為正式驗收標準。
- `Web`、`iOS`、`Android` 都必須透過同一個 shell script 入口執行，並驗證同一套 contract cases。
- 各平台可自行補充私有測試作為輔助，但不得取代或偏離共用 contract test。
- Fail 時先定位對應平台 plugin class；不得以修改 contract 規避問題。

正式測試至少涵蓋：

- `Options`
- `Lifecycle`
- `Status`
- `Permissions`
- `ErrorHandling`
- `EdgeCases`

說明：

- 若正式目錄仍維持五個 spec 檔，`Permissions` 可併入 `error-handling.spec.ts` 與 `edge-cases.spec.ts`。
- 若未來權限流程擴大，再獨立拆出 `permissions.spec.ts`。

### 6.1 測試單元設計準則

- 測試單元應以 `definitions.ts` 為唯一正式來源，不應以單一平台實作細節為準。
- 每個測試單元都應對應正式 contract 中的可觀測行為、狀態、事件、權限或錯誤。
- 測試單元應優先描述「驗收條件」與「預期結果」，而不是先綁定某個平台內部做法。
- 每個正式測試區塊都應同時考慮正常流程、錯誤流程與邊界情境。
- 若某條正式規則尚未 runnable，也應先以測試設計稿固定案例方向，不可只留口頭共識。

### 6.2 測試單元內容原則

- `Options` 類測試應驗證預設值、局部更新、重置與是否影響 status。
- `Lifecycle` 類測試應驗證狀態轉移是否符合 contract。
- `Status` 類測試應驗證狀態快照與 event payload 是否一致。
- `Permissions` 類測試應驗證狀態映射、請求行為與拒絕情境。
- `ErrorHandling` 類測試應驗證正式錯誤格式與錯誤碼一致性。
- `EdgeCases` 類測試應驗證重複操作、非法輸入、靜默失敗等異常邊界。

## 7. 推薦目錄結構

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

## 8. Runner 原則

- `shell script` 是唯一測試工具入口，但不是測試標準本身。
- 正式測試標準是 `definitions.ts` 與 `tests/contract`，不是特定測試框架名稱。
- `shell script` 負責環境檢查、編譯、部署、執行、收集 log、彙整失敗。
- `shell script` 可以調度不同平台的驗證流程，但不得讓 `Web / iOS / Android` 各自演變成不同正式標準。
- `shell script` 不應把 Jest、Vitest 或任何單一測試框架寫成正式 contract test 標準本身。
- Pass / fail 以 command exit status 為主，log 關鍵字解析只作輔助摘要。
- 各平台不得各自定義正式測試入口或正式驗收標準。

## 9. 維護與擴展

- 新功能或新能力應先更新 `definitions.ts` 與正式 contract tests，再進入平台實作。
- 新功能最少必須同步更新以下項目：
- `definitions.ts`
- contract tests
- `web` 實作
- `ios` 實作
- `android` 實作
- CI/CD 應統一呼叫 `scripts/test-plugin.sh` 執行正式 contract test。
- 平台私有測試可保留，但不得成為唯一驗收依據。

## 10. 核心結論

1. App 層呼叫方式不變，跨平台行為一致。
2. 測試 fail 時，優先修正對應平台 plugin class。
3. 只能有一套正式 contract test，不可有三套正式標準。
4. 測試工具入口只有一個 `shell script`，不能有三套正式入口。
5. 方法的異步行為、狀態轉移、錯誤碼、重置能力必須明確。
## Most Important Rule

- 正式 pipeline 的唯一入口是 [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)。
- 正式驗收必須先讓 `test-plugin.sh` 全綠。
- `demo` 不是正式 pipeline 的宿主。
- `demo` 只在正式 pipeline 全綠之後，用於：
  - 最後 UI 確認
  - Plugin 功能展示
  - Plugin 用法示範
- 若設計或實作方向開始讓 `demo` 承擔正式測試責任，視為偏離主線，應立即回頭檢查。

## Pipeline Manifesto

- 正式 pipeline 應站在最接近前端 app 呼叫 plugin 的位階，而不是平台私有測試位階。
- Capacitor plugin 的目的不是讓各平台各自表述，而是把平台能力收斂回前端 web 的單一使用面。
- 因此 `web` formal pipeline 的綠燈，代表正式 contract、正式測試單元與正式入口的主線設計已成立。
- 後續若 `ios` 或 `android` 無法綠燈，應優先定位為平台實作或 bridge 對齊問題，而不是回頭質疑單一 pipeline 本身。
- 平台私測若存在，只能作為短期過渡工具；不得升格為新的正式標準。
- `TodoPlugin` 的示範價值不只在功能本身，也在展示：
  - 原生能力如何透過 Capacitor bridge 回到前端單一使用面
  - 單一 contract、單一測試單元、單一入口如何形成可持續的開發流程
  - 這套流程如何節省後續開發者處理跨平台差異的時間

## Current Platform Validation Layer

- `web` 應優先作為第一條完整 formal contract pipeline。
- `ios` 與 `android` 在實務上可先以 native core 與 bridge helper coverage 起步，再逐步提升到完整 formal bridge contract tests。
- 各平台接入深度可以不同，但正式來源不能不同：
  - 唯一正式 contract 仍是 [`src/definitions.ts`](/Users/james/dev2/cap-todo-plugin/src/definitions.ts)
  - 唯一正式測試單元仍是 [`tests/contract`](/Users/james/dev2/cap-todo-plugin/tests/contract)
  - 唯一正式入口仍是 [`scripts/test-plugin.sh`](/Users/james/dev2/cap-todo-plugin/scripts/test-plugin.sh)

## Native Progression Rule

- 原生平台接入時，建議依下列順序推進：
  - native core behavior
  - bridge helper mapping
  - formal bridge contract tests
- 這個順序是為了先驗證 pipeline 可行，再逐步把 bridge 層收斂到與 `web` 同一套 contract 驗收。
- 任何中途補上的測試輔助層，都不應升格為獨立正式標準。
- 若某平台在 local unit test 中無法穩定驗證真實 bridge 行為，例如 listener payload 或 Capacitor bridge object，本規範允許升級到更合適的原生測試層，例如 Robolectric、instrumented tests 或等價方案。
- 但升級測試層後，正式 contract、正式測試單元與正式入口仍不得分裂。
