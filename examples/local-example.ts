import { S3Backend, CryptBackend, LocalBackend } from "../src/";

(async () => {
  const backend = await LocalBackend("./_local_data_");
  console.log(await backend.putObject("test", Buffer.from("this is a test"), "text/plain"));
  console.log((await (await backend.getObject("test")).getData()).toString());
  console.log("listing objects by prefix...");
  for await (let key of backend.listObjectsByPrefix()) {
    console.log(key);
  }
})();
