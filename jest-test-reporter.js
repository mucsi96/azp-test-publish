const xml = require("xml");
const fs = require("fs");
const path = require("path");

class JestReporter {
  constructor() {
    this.testsuites = [];
    this.output = [];

    process.stdout.write = message =>
      this.output.push({ error: false, message, time: Date.now() });
    process.stderr.write = message =>
      this.output.push({ error: true, message, time: Date.now() });
  }

  onTestResult({ duration }, { testResults }, { startTime }) {
    debugger;
    const durationGap =
      (duration - testResults.reduce((sum, { duration }) => sum + duration, 0)) /
      (2 * (testResults.length - 1));

    let testCaseStartTime;
    let testCaseEndTime = startTime - durationGap;

    this.testsuites.push({
      testsuite: [
        {
          _attr: { time: duration / 1000 }
        },
        ...testResults.map(testResult => {
          testCaseStartTime = testCaseEndTime;
          testCaseEndTime = testCaseEndTime + duration + 2 * durationGap;
          const output = this.output.filter(
            ({ time }) => time >= testCaseStartTime && time < testCaseEndTime
          );

          return {
            testcase: this.createTestCase({
              ...testResult,
              output
            })
          };
        })
      ]
    });
    this.output = [];
  }

  createTestCase({ fullName, duration, failureMessages, status, output }) {
    const errors = [
      status === "failed" && "Status is failed",
      output.some(({ error }) => error) && "There was output on stderr",
      output.some(({ error, message }) => !error && /error/i.test(message)) &&
        'stdout contains string "error"'
    ].filter(Boolean);

    return [
      { _attr: { name: fullName, time: duration / 1000 } },
      (errors.length || failureMessages.length) && {
        failure: [
          { _attr: { message: errors.join(". ") } },
          failureMessages.join("\n")
        ]
      },
      {
        "system-out": output.map(({ message }) => message).join("")
      }
    ].filter(Boolean);
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
