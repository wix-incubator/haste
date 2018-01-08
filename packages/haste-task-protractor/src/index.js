const execa = require('execa');
const dargs = require('dargs');

const PROTRACTOR_BIN = require.resolve('protractor/bin/protractor');
const WEBDRIVER_BIN = require.resolve('protractor/bin/webdriver-manager');

const defaultOptions = { standalone: true, gecko: 'false' };

module.exports = ({ configPath, webdriverManagerOptions = {}, debug = false }) => async () => {
  const options = { ...defaultOptions, ...webdriverManagerOptions };
  const args = dargs(options, { allowCamelCase: true, useEquals: false, ignoreFalse: false });

  await execa(WEBDRIVER_BIN, ['update', ...args], { stdio: 'inherit' });

  if (debug) {
    await execa('node', ['--inspect-brk', PROTRACTOR_BIN, configPath], { stdio: 'inherit' });
  } else {
    await execa(PROTRACTOR_BIN, [configPath], { stdio: 'inherit' });
  }
};
