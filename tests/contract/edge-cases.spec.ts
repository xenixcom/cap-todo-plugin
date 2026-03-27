describe('Contract: EdgeCases', () => {
  test.todo('requestPermissions 未提供 permissions 時，應請求所有正式對外權限');
  test.todo('requestPermissions 傳入空陣列時行為應明確且一致');
  test.todo('requestPermissions 傳入不合法權限值時應拋出 INVALID_ARGUMENT 或 UNSUPPORTED_PLATFORM');
  test.todo('平台內部更細的權限狀態應映射為 prompt、granted、denied');
  test.todo('echo 應維持最小 request/response contract，回傳 value 欄位');
  test.todo('resetOptions 與 reset 的責任分界應明確且不可互相取代');
  test.todo('重複呼叫 start 時應拋出 INVALID_STATE');
  test.todo('重複呼叫 stop 時應拋出 INVALID_STATE');
  test.todo('平台實作不得以靜默失敗、false 或空值取代正式錯誤契約');
});
