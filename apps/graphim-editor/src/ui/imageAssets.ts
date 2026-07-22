const DB_NAME = 'graphim-editor-assets';
const STORE_NAME = 'images';
const DB_VERSION = 1;

type StoredImage = {
  id: string;
  name: string;
  blob: Blob;
};

export type SavedImageAsset = {
  id: string;
  name: string;
  blob: Blob;
};

/** Persist image binary outside the JSON graph document. */
export async function saveImageAsset(file: File): Promise<SavedImageAsset> {
  const asset: StoredImage = {
    id: `asset:${crypto.randomUUID()}`,
    name: file.name,
    blob: file,
  };
  const database = await openDatabase();
  await transactionRequest(database, 'readwrite', (store) => store.put(asset));
  database.close();
  return asset;
}

export async function loadImageAsset(id: string): Promise<SavedImageAsset | null> {
  const database = await openDatabase();
  const value = await transactionRequest<StoredImage | undefined>(
    database,
    'readonly',
    (store) => store.get(id),
  );
  database.close();
  return value ?? null;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open image storage'));
  });
}

function transactionRequest<T = IDBValidKey>(
  database: IDBDatabase,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Image storage failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Image storage aborted'));
  });
}
