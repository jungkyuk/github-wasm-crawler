import * as fs from "fs";

export function getKey() {
  const keys = JSON.parse(fs.readFileSync("keys.json", "utf8"));
  return keys.pat;
}

/*
 *   Function to get all repo names in repos.txt
 *   Repos must be in form: full_name
 *   Example: 'bytecodealliance/wasmtime'
 */
export function getRepos() {
  let array = fs.readFileSync("in/repos.txt").toString().split("\n");
  // If last line in txt file is \n, remove it
  if (array[array.length - 1] === '') {
    array.pop();
  }
  return array;
}

/*
 *   Function to write the each of the wasm issues to issues.txt
 */
export function writeResults(WASM_ISSUES) {
  const writeStream = fs.createWriteStream("out/issues.txt");
  const pathName = writeStream.path;

  WASM_ISSUES.forEach((issue) => {
    writeStream.write(`${issue}\n`);
  });

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on("finish", () => {
    console.log(`Wrote ${WASM_ISSUES.length} issues to file ${pathName}\n`);
  });

  // handle the errors on the write process
  writeStream.on("error", (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`);
  });

  // close the stream
  writeStream.end();
}
