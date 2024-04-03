# github-wasm-crawler
A simple script that uses the github API to search for repositories with the topic 'wasm' associated with it and searches for issues related to security vulnerabilities within it.

## Installaion
1. Make sure you have NodeJS installed
https://nodejs.org/en/download
2. Clone the repo with `git clone`
3. Run `npm install` to install node dependencies
4. Rename `dummykeys.json` to `keys.json` and put in your own Github Personal Access Token

## Usage
Run with `node crawler.js | tee log.txt`

### Modifications
If you want to change the repos crawled through, just edit repos.txt
If you want to change query, change the `q:` parameter in `searchIssues()`
