const execa = require('execa');
const dargs = require('dargs');

const PROTRACTOR_BIN = require.resolve('protractor/bin/protractor');
const WEBDRIVER_BIN = require.resolve('protractor/bin/webdriver-manager');

const defaultOptions = { standalone: true, gecko: 'false' };

module.exports = ({ configPath, webdriverManagerOptions = {} }) => async () => {
  const options = Object.assign(defaultOptions, webdriverManagerOptions);
  const args = dargs(options, { allowCamelCase: true, useEquals: false, ignoreFalse: false });

  await execa(WEBDRIVER_BIN, ['update', ...args], { stdio: 'inherit' });
  await execa(PROTRACTOR_BIN, [configPath], { stdio: 'inherit' });
};
