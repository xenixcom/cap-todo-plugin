window.__storageProbe__ = {
  async seed(testCase) {
    const encoded = JSON.stringify(testCase.value);
    localStorage.setItem(testCase.storageKey, encoded);
    await putIndexedValue(testCase, encoded);
    return "seeded";
  },

  async verify(testCase) {
    const expected = JSON.stringify(testCase.value);
    const localRaw = localStorage.getItem(testCase.storageKey);
    const indexedRaw = await getIndexedValue(testCase);
    return `local=${classifyStorageValue(localRaw, expected)}; indexeddb=${classifyStorageValue(indexedRaw, expected)}`;
  },
};

function classifyStorageValue(raw, expected) {
  if (raw == null) {
    return "missing";
  }
  return raw === expected ? "ok" : `mismatch:${raw}`;
}

function openIndexedDb(testCase) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(testCase.dbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(testCase.storeName);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("indexeddb open failed"));
  });
}

async function putIndexedValue(testCase, encoded) {
  const db = await openIndexedDb(testCase);
  await new Promise((resolve, reject) => {
    const tx = db.transaction(testCase.storeName, "readwrite");
    tx.objectStore(testCase.storeName).put(encoded, testCase.dbKey);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("indexeddb write failed"));
    tx.onabort = () => reject(tx.error ?? new Error("indexeddb write aborted"));
  });
  db.close();
}

async function getIndexedValue(testCase) {
  const db = await openIndexedDb(testCase);
  const value = await new Promise((resolve, reject) => {
    const tx = db.transaction(testCase.storeName, "readonly");
    const request = tx.objectStore(testCase.storeName).get(testCase.dbKey);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error("indexeddb read failed"));
    tx.onabort = () => reject(tx.error ?? new Error("indexeddb read aborted"));
  });
  db.close();
  return value;
}
