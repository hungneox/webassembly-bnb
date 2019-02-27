const { readFileSync } = require("fs");

// wat2wasm hello.wat -o hello.wasm
const run = async () => {
  const buffer = readFileSync("./hello.wasm");
  const module =  await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module, {});
  console.log(instance.exports.hello());
};

run().catch(console.error);