import { Octokit, App } from "octokit";
import * as fs from 'fs';

const keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'));

// My Github Personal Access Token
const GITHUB_PAT = keys.pat;
const WASM_REPOS = ["bytecodealliance/wasmtime"];
const WASM_ISSUES = [];

// Instantiate an octokit object with my PAT
const octokit = new Octokit({
  auth: GITHUB_PAT,
});

// Search for all repos with webassembly as one of their topics
async function searchRepos() {
  // Call the search repos endpoint
  const resp = await octokit.request("GET /search/repositories", {
    q: "topic:wasm",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  //console.log(resp)
  if (repos.status != 200) {
    console.log(`Error: Status code ${repos.status}`);
  }

  // Push all repo names
  const data = resp.data;
  data.forEach((repo) => {
    WASM_REPOS.push(repo["full_name"]);
  });
}

// Search for all issues for each repo found
async function searchIssues() {
  for (let i in WASM_REPOS) {
    const repo = WASM_REPOS[i];

    const resp = await octokit.paginate("GET /search/issues", {
      q: `security OR vulerability is:issue repo:${repo}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 100,
    });

    console.log(resp.length);
    resp.forEach((issue) => {
      WASM_ISSUES.push(issue.url);
    });
  }

  console.log(WASM_ISSUES, WASM_ISSUES.length);
}

function writeResults() {
  const writeStream = fs.createWriteStream("issues.txt");
  const pathName = writeStream.path;

  WASM_ISSUES.forEach((issue) => {
    writeStream.write(`${issue}\n`);
  });

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on("finish", () => {
    console.log(`wrote all the array data to file ${pathName}`);
  });

  // handle the errors on the write process
  writeStream.on("error", (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`);
  });

  // close the stream
  writeStream.end();
}

// Call the functions
// await searchRepos();
await searchIssues();
writeResults();
