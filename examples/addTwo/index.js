const { readFileSync } = require("fs");

// wat2wasm add.wat -o add.wasm
const run = async () => {
  const buffer = readFileSync("./add.wasm");
  const module =  await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module, {});
  console.log(instance.exports.add(1, 2));
};

run().catch(console.error);