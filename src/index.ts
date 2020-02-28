export {StorageBackend, StorageObject} from "./storagebackend";
export {default as S3Backend} from "./backends/s3";
export {default as CryptBackend} from "./backends/crypt";
import S3Backend from "./backends/s3";
import CryptBackend from "./backends/crypt";


// (async () => {
//   const backend = await S3Backend({
//     accessKeyId: 'zUFniuAvkeP9XrRa8jXvnLuHzMhxFmTm' ,
//     secretAccessKey: 'cWoAHZuzap26KprrDqPevCGMZiiefqmL' ,
//     endpoint: 'http://10.22.13.20:9768/',
//     s3ForcePathStyle: true, // needed with minio?
//     signatureVersion: 'v4'
//   }, "scraped-data");
//   const crypt = await CryptBackend(backend, "my encryption key");
//   console.log(await crypt.putObject("test", Buffer.from("this is a test"), "text/plain"));
//   console.log((await (await crypt.getObject("test")).getData()).toString());
//   console.log("listing objects by prefix...");
//   for await (let key of crypt.listObjectsByPrefix()) {
//     console.log(key);
//   }
// })();