
export abstract class StorageObject {
  abstract getID(): string;
  abstract getKey(): string;
  abstract getMimetype(): string | null;
  abstract getData(): Promise<Uint8Array>;
};

export abstract class StorageBackend {
  /**
   * store an object in the backing store 
   * @param key 
   * @param object 
   */
  abstract putObject(key: string, object: Uint8Array, mimetype: string): Promise<string>; // object id 

  /**
   * get an object by its key from the backing store
   * @param key 
   */
  abstract getObject(key: string): Promise<StorageObject>;

  /**
   * get an object efficiently by its id 
   * @param id 
   */
  abstract getObjectById(id: string): Promise<StorageObject>;

  /**
   * list objects as they occur by a common prefix
   * @param prefix 
   */
  abstract listObjectsByPrefix(prefix?: string): AsyncGenerator<string>;
}