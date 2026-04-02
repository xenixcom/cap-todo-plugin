import type { PluginListenerHandle } from '@capacitor/core';

// ------------------------------------------------------------
// MARK: - Status
// ------------------------------------------------------------

/**
 * Plugin 的對外狀態。
 *
 * - `init`: 初始化或重置進行中
 * - `idle`: 可運作但尚未啟動
 * - `running`: 功能執行中
 *
 * `status` 只表達正式運作狀態，不包含錯誤狀態。
 * 若操作失敗，應以正式錯誤契約 throw / reject，
 * 而不是把 `error` 混入 status。
 */
export type PluginStatus = 'init' | 'idle' | 'running';

// ------------------------------------------------------------
// MARK: - Options
// ------------------------------------------------------------

/**
 * Plugin 的正式設定選項。
 *
 * 這裡只保留示範型 contract 最常見、最容易跨平台對齊的欄位。
 *
 * - `enabled`: 是否允許 plugin 進入可執行流程
 * - `debug`: 是否啟用除錯輔助行為
 */
export interface PluginOptions {
  enabled: boolean;
  debug: boolean;
}

// ------------------------------------------------------------
// MARK: - Permissions
// ------------------------------------------------------------

/**
 * 目前示範型 contract 只保留一種權限，
 * 但型別結構保留未來擴充多權限的空間。
 */
export type PluginPermissionName = 'microphone';

/**
 * 對 App 層暴露的統一權限狀態。
 *
 * 平台內部若有更細的原生權限狀態，
 * 必須先映射到這三種後才能對外回傳。
 *
 * 例如 Android 的 `prompt-with-rationale`
 * 也必須先收斂成這裡的 `prompt`。
 */
export type PluginPermissionState = 'prompt' | 'granted' | 'denied';

export interface PluginPermissionStatus {
  microphone: PluginPermissionState;
}

// ------------------------------------------------------------
// MARK: - Availability
// ------------------------------------------------------------

/**
 * Plugin 對外可用性快照。
 *
 * - `supported`: 目前平台或執行環境是否具備這項能力
 * - `enabled`: 目前 plugin options 是否允許進入主流程
 *
 * 這份結果用來區分：
 * - unsupported by platform
 * - disabled by current configuration
 *
 * 它不取代正式錯誤契約，只提供 App 層在操作前的能力探測。
 */
export interface PluginAvailabilityResult {
  supported: boolean;
  enabled: boolean;
}

/**
 * 指定要請求哪些權限。
 *
 * 若未提供，則表示請求此 plugin 所有正式對外權限。
 *
 * 目前示範型 contract 只保留 `microphone`，
 * 但這個型別刻意保留未來擴充多權限的空間。
 */
export interface PermissionRequestOptions {
  permissions: PluginPermissionName[];
}

// ------------------------------------------------------------
// MARK: - Errors
// ------------------------------------------------------------

/**
 * Plugin 對外正式錯誤碼。
 *
 * App 層應依賴 `code`，而不是依賴 `message` 文字。
 */
export type PluginErrorCode =
  | 'UNAVAILABLE'
  | 'UNSUPPORTED_PLATFORM'
  | 'PERMISSION_DENIED'
  | 'INVALID_ARGUMENT'
  | 'INVALID_STATE'
  | 'OPERATION_FAILED';

/**
 * Plugin 對外統一錯誤格式。
 *
 * 所有 throw / reject 到 App 層的正式錯誤都必須至少符合這個形狀。
 *
 * App 層應依賴 `code` 進行正式流程判斷，
 * `message` 只作為輔助說明與除錯資訊。
 */
export interface PluginError {
  code: PluginErrorCode;
  message: string;
}

// ------------------------------------------------------------
// MARK: - Results
// ------------------------------------------------------------

export interface EchoOptions {
  value: string;
}

export interface EchoResult {
  value: string;
}

export interface StatusResult {
  status: PluginStatus;
}

export interface SessionResult {
  sessionId: string;
}

/**
 * 狀態變化事件。
 *
 * 只有正式狀態變化時才應觸發 `statusChange`。
 * 若呼叫方法後狀態未改變，不應額外推送 event。
 */
export interface StatusChangeEvent {
  status: PluginStatus;
}

// ------------------------------------------------------------
// MARK: - TodoPlugin
// ------------------------------------------------------------

/**
 * TodoPlugin 的正式對外 contract。
 *
 * 這份定義的目的不是展示某個特定功能做多完整，
 * 而是展示一份可跨平台、可測、可讓 AI 持續迭代的 plugin 協議。
 */
export interface TodoPlugin {
  /**
   * 取得目前 plugin 狀態。
   *
   * 回傳的是目前正式狀態快照，
   * 不是最後一次事件通知結果，也不是操作歷史。
   */
  getStatus(): Promise<StatusResult>;

  /**
   * 取得目前生效的 plugin options。
   */
  getOptions(): Promise<PluginOptions>;

  /**
   * 局部更新 plugin options。
   *
   * 未提供的欄位必須保留原值，不可整體覆蓋。
   * 此方法只更新 options，不應隱式觸發 lifecycle 狀態變化。
   */
  setOptions(options: Partial<PluginOptions>): Promise<void>;

  /**
   * 只重置 options，不改變目前狀態。
   *
   * 執行後 options 應回到預設值，但 `status` 保持不變。
   */
  resetOptions(): Promise<void>;

  /**
   * 啟動 plugin 主要功能。
   *
   * 當 `enabled = false` 時，應拋出 `INVALID_STATE`。
   * 當目前狀態不允許啟動時，也應拋出 `INVALID_STATE`。
   */
  start(): Promise<void>;

  /**
   * 啟動一個最小長存 session，回傳正式 session token。
   *
   * 這個方法不是完整 watch/stream API，
   * 而是先提供一個最小可測的 session archetype 壓測點。
   *
   * 規則：
   * - 成功建立後應使狀態進入 `running`
   * - 若目前已有活躍 session，應拋出 `INVALID_STATE`
   */
  openSession(): Promise<SessionResult>;

  /**
   * 停止 plugin 主要功能，成功後回到 `idle`。
   */
  stop(): Promise<void>;

  /**
   * 關閉既有 session。
   *
   * 規則：
   * - 只有傳入目前活躍的 session token 才能成功
   * - 關閉後應回到 `idle`
   * - 不合法或過期 token 應拋出 `INVALID_ARGUMENT`
   */
  closeSession(sessionId: string): Promise<void>;

  /**
   * 重置 plugin。
   *
   * 流程應為 `init -> idle`。
   *
   * 此方法會重置 options 與內部運作狀態。
   * 若重置失敗，應以正式錯誤契約 throw / reject，
   * 不可假裝回到 `idle`。
   */
  reset(): Promise<void>;

  /**
   * 取得目前權限狀態。
   *
   * 對 App 層只允許回傳 `prompt | granted | denied`。
   * 各平台內部更細的原生權限狀態必須先完成映射。
   */
  checkPermissions(): Promise<PluginPermissionStatus>;

  /**
   * 取得目前 capability availability。
   *
   * 這個方法應提供操作前的正式能力探測，
   * 讓 App 層可先判斷：
   * - 平台是否支援
   * - 目前設定是否允許執行
   */
  getAvailability(): Promise<PluginAvailabilityResult>;

  /**
   * 請求權限。
   *
   * 若未提供 `permissions`，表示請求所有正式對外權限。
   *
   * 不支援的權限請求應拋出 `INVALID_ARGUMENT`
   * 或 `UNSUPPORTED_PLATFORM`，不可靜默忽略。
   */
  requestPermissions(
    options?: PermissionRequestOptions,
  ): Promise<PluginPermissionStatus>;

  /**
   * 最小示範方法，用來驗證基礎 request / response contract。
   *
   * 這不是核心 lifecycle 能力，
   * 而是示範一個最小可驗證的功能型方法。
   */
  echo(options: EchoOptions): Promise<EchoResult>;

  /**
   * 註冊狀態變化監聽器。
   *
   * 只有正式狀態變化時才應觸發 `statusChange`。
   * App 層可依此同步 UI 或流程狀態，但不應取代 `getStatus()`。
   */
  addListener(
    eventName: 'statusChange',
    listenerFunc: (event: StatusChangeEvent) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * 移除所有已註冊監聽器。
   */
  removeAllListeners(): Promise<void>;
}
