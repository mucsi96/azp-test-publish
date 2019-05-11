const xml = require("xml");
const fs = require("fs");
const path = require("path");

const testName = path.basename(
  jasmine.testPath,
  path.extname(jasmine.testPath)
);

class JasmineJUnitReporter {
  constructor() {
    this.testcases = [];
    this.output = [];

    process.stdout.write = message =>
      this.output.push(message);
    process.stderr.write = message =>
      this.output.push(message);
  }

  createTestCase({ name, status, failure, duration }) {
    const errors = [
      status === "failed" && "Status is failed",
      this.output.some(
        message => /error/i.test(message)
      ) && 'stdout contains string "error"',
    ].filter(Boolean);

    return [
      { _attr: { name, time: duration / 1000 } },
      (failure || errors.length) && {
        failure: {
          _attr: {
            message: failure ? failure.message : errors.join(". ")
          },
          _cdata: failure && (failure.stack || failure.message)
        }
      },
      {
        "system-out": {
          _cdata: this.output.join("")
        }
      }
    ].filter(Boolean);
  }

  jasmineStarted() {
    this.jasmineStartTime = Date.now();
  }

  suiteStarted() {}

  specStarted() {
    this.specStartTime = Date.now();
  }

  specDone({ description, fullName, status, failedExpectations }) {
    debugger;
    const descIndex = fullName.indexOf(description);
    const name = [fullName.slice(0, descIndex), description].join(":: ");
    const duration = Date.now() - this.specStartTime;
    this.testcases.push({
      testcase: this.createTestCase({
        name,
        status,
        failure: failedExpectations[0],
        duration
      })
    });
    this.output = [];
  }

  suiteDone() {}

  jasmineDone() {
    debugger;
    const duration = Date.now() - this.jasmineStartTime;

    fs.writeFileSync(
      path.resolve(__dirname, `${testName}.junit.xml`),
      xml({
        testsuites: [
          {
            testsuite: [{ _attr: { time: duration / 1000 } }, ...this.testcases]
          }
        ]
      }),
      "utf8"
    );
  }
}

jasmine.getEnv().addReporter(new JasmineJUnitReporter());
