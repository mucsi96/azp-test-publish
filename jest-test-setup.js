const jasmineReporters = require('jasmine-reporters');

jasmine.VERBOSE = true;

jasmine.getEnv().addReporter(
    new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      captureStdout: true,
      filePrefix: "jasmine-junit"
    })
  );

debugger;