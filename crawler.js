import { Octokit } from "octokit";
import { getKey, getRepos, writeResults } from "./text-handler.js";

// My Github Personal Access Token
const GITHUB_PAT = getKey();
const WASM_REPOS = getRepos();
const WASM_ISSUES = [];

// Instantiate an octokit object with my PAT
const octokit = new Octokit({
  auth: GITHUB_PAT,
});

// Search for all issues for each repo found
async function searchIssues() {
  for (let i in WASM_REPOS) {
    const repo = WASM_REPOS[i];
    console.log(`Attempting to get issues in ${repo}...`)

    const resp = await octokit.paginate("GET /search/issues", {
      q: `security OR vulerability is:issue repo:${repo}`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      per_page: 100,
    });
    console.log(`${resp.length} results found...`)

    resp.forEach((issue) => {
      WASM_ISSUES.push(issue.url);
    });
  }

  // Write the results to issues.txt
  writeResults(WASM_ISSUES);
}

searchIssues();