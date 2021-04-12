import { StorageBackend, StorageObject } from "../storagebackend";
import crypto from "crypto";

class CryptStorageObject extends StorageObject {
  private baseObject: StorageObject;
  private encryptionKey: Uint8Array;
  constructor(baseObject: StorageObject, encryptionKey: Uint8Array) {
    super();
    this.baseObject = baseObject;
    this.encryptionKey = encryptionKey;
  }

  getID() {
    return this.baseObject.getID();
  }
  getKey() {
    return this.baseObject.getKey();
  }
  getMimetype() {
    return this.baseObject.getMimetype();
  }
  async getData() {
    const data = await this.baseObject.getData();
    const iv = data.slice(0, 16);
    const encrypted = data.slice(16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted;
  }
}

class CryptBackend extends StorageBackend {
  private backend: StorageBackend;
  private encryptionKey: Uint8Array;

  constructor(encryptionKey: string, backend: StorageBackend) {
    super();
    this.backend = backend;
    this.encryptionKey = crypto.createHash("sha256").update(encryptionKey).digest().slice(0, 32);
  }

  putObject(key: string, object: Uint8Array, mimetype: string) {
    // TODO: generate encryption iv
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, iv);
    const encrypted = Buffer.concat([iv, cipher.update(object), cipher.final()]);
    return this.backend.putObject(key, encrypted, mimetype);
  }

  async getObject(key: string): Promise<StorageObject> {
    const res: StorageObject = await this.backend.getObject(key);
    return new CryptStorageObject(res, this.encryptionKey);
  }

  getObjectById(id: string): Promise<StorageObject> {
    return this.backend.getObjectById(id);
  }

  listObjectsByPrefix(prefix?: string) {
    return this.backend.listObjectsByPrefix(prefix);
  }
}

export default async (backend: StorageBackend, encryptionKey: string) => {
  return new CryptBackend(encryptionKey, backend);
};
