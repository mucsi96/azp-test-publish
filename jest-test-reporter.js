const xml = require("xml");
const fs = require("fs");
const path = require("path");

class JestReporter {
  constructor() {
    this.testsuites = [];
    this.output = [];
    this.hasError = false;

    process.stdout.write = message => this.output.push(message);
    process.stderr.write = message => {
      this.output.push(message);
      this.hasError = true;
    };
  }

  onTestResult({ duration }, { testResults }) {
    debugger;
    this.testsuites.push({
      testsuite: [
        {
          _attr: { time: duration / 1000 }
        },
        ...testResults.map(
          ({ fullName, duration, status, failureMessages }) => ({
            testcase: this.createTestCase({
              fullName,
              duration,
              failureMessages,
              status
            })
          })
        )
      ]
    });
    this.output = [];
    this.hasError = false;
  }

  createTestCase({ fullName, duration, failureMessages, status }) {
    const errors = [
      status === "failed" && "Status is failed",
      this.hasError && "There was output on stderr",
      /error/i.test(this.output) && 'Output contains "error"'
    ].filter(Boolean);

    return [
      { _attr: { name: fullName, time: duration / 1000 } },
      {
        failure: [
          { _attr: { message: errors.join(". ") } },
          failureMessages.join("\n")
        ]
      },
      {
        "system-out": this.output.join("")
      }
    ];
  }

  onRunComplete() {
    fs.writeFileSync(
      path.resolve(__dirname, "jest-junit.xml"),
      xml({ testsuites: this.testsuites }),
      "utf8"
    );
  }
}

module.exports = JestReporter;
