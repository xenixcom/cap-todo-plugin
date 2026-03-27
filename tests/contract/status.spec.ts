describe('Contract: Status', () => {
  test.todo('getStatus 應回傳物件型別，且包含 status 欄位');
  test.todo('status 只允許 init、idle、running 三種正式狀態');
  test.todo('getStatus 應與最近一次正式狀態轉移結果一致');
  test.todo('start 後 getStatus 應回傳 running');
  test.todo('stop 後 getStatus 應回傳 idle');
  test.todo('reset 後 getStatus 最終應回到 idle');
  test.todo('statusChange event payload 應與 getStatus 的正式狀態一致');
  test.todo('正式狀態變化時應觸發 statusChange event');
  test.todo('未發生正式狀態變化時，不應額外推送 statusChange event');
});
