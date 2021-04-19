import crypto from "crypto";
import stream from "stream";

// TODO: these absolutely do not work as implemented right now.
/*

export class DecryptStream extends stream.Transform {
  private key: Uint8Array;
  private iv: Uint8Array = Buffer.alloc(0);
  private decrypt: crypto.Decipher | null = null;

  constructor(key: Uint8Array) {
    super();
    this.key = key;
  }

  _transform(chunk: Uint8Array, encoding: string, done) {
    if (this.iv.length < 16) {
      let slice = chunk.slice(0, Math.min(chunk.length, 16 - this.iv.length));
      this.iv = Buffer.concat([this.iv, slice]);

      if (this.iv.length >= 16) {
        this.decrypt = crypto.createDecipheriv("aes-256-gcm", this.key, this.iv);
        this.decrypt.on("data", (data) => {
          this.push(data, encoding);
        });
      }

      chunk = chunk.slice(slice.length);
    }

    if (this.decrypt) {
      this.decrypt.write(chunk);
    }

    done();
  }

  _destroy() {
    super._destroy();
  }
}

export class CryptStream extends stream.Transform {
  private key: Uint8Array;
  private iv: Uint8Array;
  private crypt: crypto.Cipher | null = null;
  private firstChunk: boolean = false;

  constructor(key: Uint8Array) {
    super();
    this.key = key;
    this.iv = crypto.randomBytes(16);
    this.crypt = 
  }

  _transform(chunk: Uint8Array, encoding: string, done) {
    if (!crypt) {
      this.crypt = crypto.createCipheriv("aes-256-gcm", this.key, this.iv);
    }

    this.push(this.iv, encoding);
    this.push(chunk, encoding);

    done();
  }
}
*/
