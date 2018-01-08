const execa = require('execa');
const dargs = require('dargs');

const PROTRACTOR_BIN = require.resolve('protractor/bin/protractor');
const WEBDRIVER_BIN = require.resolve('protractor/bin/webdriver-manager');

const defaultWebdriverOptions = { standalone: true, gecko: 'false' };
const dargsSettings = { allowCamelCase: true, useEquals: false, ignoreFalse: false };

module.exports = async ({ configPath, webdriverManagerOptions = {}, protractorOptions = {} }) => {
  const webdriverOptions = { ...defaultWebdriverOptions, ...webdriverManagerOptions };

  const webdriverArgs = dargs(webdriverOptions, dargsSettings);
  const protractorArgs = dargs(protractorOptions, dargsSettings);

  await execa(WEBDRIVER_BIN, ['update', ...webdriverArgs], { stdio: 'inherit' });
  await execa(PROTRACTOR_BIN, [...protractorArgs, configPath], { stdio: 'inherit' });
};
