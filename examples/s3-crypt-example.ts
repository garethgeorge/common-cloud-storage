import { S3Backend, CryptBackend } from "../src/";
import process from "process";

(async () => {
  const backend = await S3Backend(
    {
      accessKeyId: process.env["ACCESS_KEY_ID"],
      secretAccessKey: process.env["SECRET_ACCESS_KEY"],
      endpoint: "https://minio.unraid.lastpengu.in/",
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: "v4",
    },
    "scraped-data"
  );
  const crypt = await CryptBackend(backend, "my encryption key");
  console.log(await crypt.putObject("test", Buffer.from("this is a test"), "text/plain"));
  console.log((await (await crypt.getObject("test")).getData()).toString());
  console.log("listing objects by prefix...");
  for await (let key of crypt.listObjectsByPrefix()) {
    console.log(key);
  }
})();
