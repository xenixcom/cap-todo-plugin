# Contract Tests

這裡是 Capacitor plugin 的唯一正式測試規格來源。

原則：

- 所有正式驗收案例都放在這裡。
- `Web`、`iOS`、`Android` 都必須驗證這一套 contract。
- 各平台可以有輔助測試，但不得取代這裡的正式測試。
- `scripts/test-plugin.sh` 是唯一正式測試工具入口，負責調度這裡的測試。

建議拆分：

- `options.spec.ts`
- `lifecycle.spec.ts`
- `status.spec.ts`
- `error-handling.spec.ts`
- `edge-cases.spec.ts`

目前這些 spec 檔的角色是：

- 所有 spec 都是正式驗收內容與案例來源
- `web` 端目前已可透過 `npm test` 執行完整 formal contract tests
- `iOS / Android` 仍應沿同一套 spec 逐步接入，不得自行發展第二套正式標準

其中：

- `Permissions` 可先併入 `error-handling.spec.ts` 與 `edge-cases.spec.ts`
- 若未來權限流程擴大，再獨立拆出 `permissions.spec.ts`

建議測試情境矩陣：

### Options

- 讀取預設 options
- 局部更新單一欄位
- 局部更新多個欄位
- 傳入空物件
- `resetOptions()` 後恢復預設值
- `resetOptions()` 不影響目前 status

### Lifecycle

- 初始化完成後進入 `idle`
- `start()` 使 `idle -> running`
- `stop()` 使 `running -> idle`
- `reset()` 使 `init -> idle`
- `enabled = false` 時拒絕 `start()`

### Status

- `getStatus()` 回傳正式狀態快照
- `status` 僅允許 `init | idle | running`
- `statusChange` payload 與正式狀態一致
- 發生正式狀態改變時才推送 event
- 未發生狀態改變時不得推送多餘 event

### Error Handling

- 權限拒絕
- 平台不支援
- 能力暫時不可用
- 參數不合法
- 狀態不合法
- 對外錯誤缺少 `code` 或 `message`

### Edge Cases

- 重複呼叫 `start()`
- 重複呼叫 `stop()`
- `requestPermissions()` 未提供 `permissions`
- `requestPermissions()` 傳入不合法值
- 平台內部特殊權限狀態映射
- 平台實作以靜默失敗、`false`、空值取代正式錯誤
