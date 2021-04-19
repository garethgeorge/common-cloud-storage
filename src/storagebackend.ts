export abstract class StorageObject {
  abstract getKey(): string;
  /**
   * Used to get the size of the object, can also be used as an efficient existance check. Throws error if object not found.
   */
  abstract getSize(): Promise<number>;

  /**
   * Returns object data as a Uint8Array.
   */
  abstract getData(): Promise<Uint8Array>;
}

export abstract class StorageBackend {
  /**
   * store an object in the backing store. Throws an exception if write fails.
   * @param key
   * @param object
   */
  abstract putObject(key: string, object: Uint8Array): Promise<void>;

  /**
   * get an object by its key from the backing store
   * @param key
   */
  abstract getObject(key: string): StorageObject;

  /**
   * list objects as they occur by a common prefix
   * @param prefix
   */
  abstract listObjectsByPrefix(prefix?: string): AsyncGenerator<string>;
}
