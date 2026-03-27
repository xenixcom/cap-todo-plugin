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
