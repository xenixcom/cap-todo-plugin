describe('Contract: Options', () => {
  test.todo('getOptions 應回傳目前生效的 options 物件');
  test.todo('預設 options 應至少包含 enabled 與 debug');
  test.todo('預設 options 的 enabled 應為 true');
  test.todo('預設 options 的 debug 應為 false');
  test.todo('setOptions 應只更新提供的欄位，未提供欄位保留原值');
  test.todo('setOptions({ enabled: false }) 不應影響 debug');
  test.todo('setOptions({ debug: true }) 不應影響 enabled');
  test.todo('setOptions({}) 不應改變任何既有 options');
  test.todo('setOptions 不應隱式改變目前 status');
  test.todo('resetOptions 應將 options 恢復為預設值');
  test.todo('resetOptions 不應改變目前 status');
});
