describe('Contract: ErrorHandling', () => {
  test.todo('所有正式錯誤都應至少包含 code 與 message');
  test.todo('App 層正式流程判斷應以 code 為主，不依賴 message');
  test.todo('enabled = false 時呼叫 start 應拋出 INVALID_STATE');
  test.todo('狀態不合法時呼叫 start 或 stop 應拋出 INVALID_STATE');
  test.todo('權限被拒絕時應拋出 PERMISSION_DENIED');
  test.todo('不支援的平台或能力應拋出 UNSUPPORTED_PLATFORM 或 UNAVAILABLE');
  test.todo('不合法參數應拋出 INVALID_ARGUMENT');
  test.todo('重置失敗時不得假裝回到 idle，應拋出正式錯誤');
});
