import { StorageBackend, StorageObject } from "../storagebackend";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import mkdirp from "mkdirp";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

class LocalStorageObject extends StorageObject {
  private fullpath: string;
  private key: string;
  constructor(key: string, fullpath: string) {
    super();
    this.key = key;
    this.fullpath = fullpath;
  }

  getID() {
    return this.key;
  }

  getKey() {
    return this.key;
  }

  async getSize() {
    return (await stat(this.fullpath)).size;
  }

  async getMimetype() {
    return null;
  }

  getData() {
    return readFile(this.fullpath);
  }
}

class LocalBackend extends StorageBackend {
  private rootDir: string;

  constructor(rootDir: string) {
    super();
    this.rootDir = path.normalize(rootDir);
  }

  fullpath(key: string): string {
    const fullpath = path.join(this.rootDir, key);
    if (fullpath.indexOf(this.rootDir) !== 0) {
      throw new Error("bad key -- attempted to escape rootDir");
    }
    return fullpath;
  }

  async putObject(key: string, object: Buffer) {
    const fullpath = this.fullpath(key);
    try {
      await writeFile(fullpath, object);
    } catch (e) {
      await mkdirp(path.dirname(fullpath));
      await writeFile(fullpath, object);
    }
  }

  getObject(key: string): StorageObject {
    const fullpath = this.fullpath(key);
    return new LocalStorageObject(key, fullpath);
  }

  async *listObjectsByPrefix(prefix?: string): AsyncGenerator<string> {
    if (!prefix) {
      prefix = "";
    }
    async function* walk(dir: string): AsyncGenerator<string> {
      for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
      }
    }
    let rootDir = this.rootDir;
    let lastSlash = prefix.lastIndexOf("/");
    if (lastSlash !== -1) {
      rootDir = this.fullpath(prefix.substring(0, lastSlash));
    }

    for await (const entry of walk(rootDir)) {
      const resolvedPath = entry.substring(this.rootDir.length + 1);
      if (resolvedPath.startsWith(prefix)) {
        yield resolvedPath;
      }
    }
  }
}

export default async (rootDir: string) => {
  return new LocalBackend(rootDir);
};
