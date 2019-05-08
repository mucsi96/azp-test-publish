const xml = require("xml");
const fs = require("fs");
const path = require("path");
const report = { a: 1 };

class JestReporter {
  constructor() {
    this.output = [];
    // process.stdout.on('data', message => this.output.push(message));
    // process.stderr.on('data', message => this.output.push(message));
  }

  onTestResult(contexts, results) {}

  onRunComplete() {
    fs.writeFileSync(
      path.resolve(__dirname, "jest-junit.xml"),
      xml(report),
      "utf8"
    );
  }
}

module.exports = JestReporter;
