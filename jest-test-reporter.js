const xml = require("xml");
const fs = require("fs");
const path = require("path");
const testsuites = [];
let output = [];
let hasError = false;

class JestReporter {
  constructor() {
    output = [];
    process.stdout.write = message => output.push(message);
    process.stderr.write = message => {
      output.push(message);
      hasError = true;
    };
  }

  onTestResult({ duration }, { testResults }) {
    debugger;
    testsuites.push({
      testsuite: [
        {
          _attr: { time: duration / 1000 }
        },
        ...testResults.map(
          ({ fullName, duration, status, failureMessages }) => ({
            testcase: [
              { _attr: { name: fullName, time: duration / 1000 } },
              ...failureMessages.map(failureMessage => ({
                failure: failureMessage
              })),
              hasError && {
                failure: 'There was output on stderr'
              },
              /error/i.test(output) && {
                failure: 'Output contains "error"'
              },
              {
                "system-out": output.join("")
              }
            ].filter(Boolean)
          })
        )
      ]
    });
    output = [];
    hasError = false;
  }

  onRunComplete() {
    fs.writeFileSync(
      path.resolve(__dirname, "jest-junit.xml"),
      xml({ testsuites }),
      "utf8"
    );
  }
}

module.exports = JestReporter;
