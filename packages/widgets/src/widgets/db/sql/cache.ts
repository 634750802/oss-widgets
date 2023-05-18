function promisify<T> (request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });

}

const request = indexedDB.open('cache:db/sql');

request.onupgradeneeded = ev => {
  const db = request.result;
  db.createObjectStore('main');
};

const database = promisify(request);

export async function getCache (db: string, sql: string) {
  const tx = (await database).transaction('main');
  const main = tx.objectStore('main');
  const res = await promisify(main.get(`${db}:${sql}`));
  tx.commit();
  return res;
}

export async function setCache (db: string, sql: string, result: any) {
  const tx = (await database).transaction('main', 'readwrite');
  const main = tx.objectStore('main');
  await promisify(main.put(result, `${db}:${sql}`));
  tx.commit();
}
