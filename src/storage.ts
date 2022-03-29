type MaybePromise<T> = T | Promise<T>;

/**
 * Basic interface required to manage tokens for the `Client`. The client handles parallelism, these
 * are simple functions that manipulate some kind of persistent storage.
 */
export interface AsyncStorage {
  getItem(key: string): MaybePromise<string | null>;
  setItem(key: string, value: string): MaybePromise<void>;
  removeItem(key: string): MaybePromise<void>;
}

export function createInMemoryStorage(): AsyncStorage {
  const data: Record<string, string | undefined> = {};

  return {
    getItem(key) {
      return data[key] ?? null;
    },
    setItem(key, value) {
      data[key] = value;
    },
    removeItem(key) {
      delete data[key];
    },
  };
}
