import {S3} from "aws-sdk";
import {StorageBackend, StorageObject} from "../storagebackend";

class S3StorageObject extends StorageObject {
  private id: string;
  private key: string;
  private mimetype: string | null;
  private data: Uint8Array;
  constructor(key: string, s3response: any) {
    super();
    this.key = key;
    this.id = key;
    this.mimetype = s3response.ContentType;
    this.data = s3response.Body;
  }
  
  getID() {
    return this.id;
  }
  getKey() {
    return this.key;
  }
  getMimetype() {
    return this.mimetype || null;
  }
  async getData() {
    return this.data;
  }
}

class S3Backend extends StorageBackend {
  private s3: S3;
  private bucket: string;

  constructor(options: any, bucket: string, sseEncryptionKey?: string) {
    super();
    this.s3 = new S3(options);
    this.bucket = bucket;
  }

  async putObject(key: string, object: Uint8Array, mimetype: string = "application/octet-stream", params: any = {}) {
    await this.s3.putObject(Object.assign({}, {
      Bucket: this.bucket,
      Key: key,
      Body: object,
      ContentType: mimetype,
    }, params)).promise();
    return key;
  }
  
  async getObject(key: string, params: any = {}): Promise<StorageObject> {
    const req = Object.assign({}, {
      Bucket: this.bucket,
      Key: key,
    }, params);

    const resp = await this.s3.getObject(req).promise();

    return new S3StorageObject(key, resp);
  }

  getObjectById(id: string): Promise<StorageObject> {
    return this.getObject(id); // keys and ids are the same for S3
  }

  async *listObjectsByPrefix(prefix?: string, params: any = {}) {
    const reqParams: any = Object.assign({}, {
      Bucket: this.bucket,
      Prefix: prefix,
    }, params);

    for (;;) {
      const data = await this.s3.listObjects(reqParams).promise();
      if (!data.Contents)
        throw new Error("data.Contents was not defined");
      
      for (const obj of data.Contents) {
        if (obj.Key)
          yield obj.Key;
      }
      if (!data.IsTruncated) {
        break;
      }
      reqParams.Marker = data.NextMarker;
    }
  }
}

export default async (options: any, bucket: string) => {
  return new S3Backend(options, bucket);
}