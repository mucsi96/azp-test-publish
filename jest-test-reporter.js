const xml = require("xml");
const fs = require("fs");
const path = require("path");
const report = { a: 1 };

class JestReporter {
  constructor() {
    report.output = [];
    process.stdout.write = message => report.output.push(message);
    process.stderr.write = message => report.output.push(message);
    console.log = message => report.output.push(message);
  }

  onTestResult(contexts, results) {}

  onRunComplete() {
    report.a = report.output.join('');
    fs.writeFileSync(
      path.resolve(__dirname, "jest-junit.xml"),
      xml(report),
      "utf8"
    );
  }
}

module.exports = JestReporter;
