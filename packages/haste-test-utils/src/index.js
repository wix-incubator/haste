const { createRunner } = require('haste-core');
const { createSetup } = require('haste-test-utils-core');

module.exports.setup = createSetup(createRunner);
