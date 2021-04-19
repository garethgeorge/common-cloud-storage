import { CryptBackend, LocalBackend } from "../src/";

(async () => {
  const backend = await LocalBackend("./_local_data_");
  console.log(await backend.putObject("test", Buffer.from("this is a test")));
  console.log(await backend.putObject("hello-world/test", Buffer.from("this is a test")));
  console.log((await backend.getObject("test").getData()).toString());
  console.log("listing objects by prefix...");
  for await (let key of backend.listObjectsByPrefix()) {
    console.log(key);
  }

  console.log("listing objects by prefix 'hello-world/t'");
  for await (let key of backend.listObjectsByPrefix("hello-world/t")) {
    console.log(key);
  }
  console.log("listing objects by prefix 'hello-world'");
  for await (let key of backend.listObjectsByPrefix("hello-world")) {
    console.log(key);
  }
})();
