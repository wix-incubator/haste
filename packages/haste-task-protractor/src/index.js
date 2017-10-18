const execa = require('execa');

const PROTRACTOR_BIN = require.resolve('protractor/bin/protractor');
const WEBDRIVER_BIN = require.resolve('protractor/bin/webdriver-manager');

const defaultArgs = ['--standalone', '--gecko', 'false'];

module.exports = ({ configPath, webdriverManagerArgs = [] }) => async () => {
  const { stdout } = await execa(WEBDRIVER_BIN, ['status']);

  console.log(stdout);

  // if (stdout.includes('chromedriver version available')) {
  await execa(WEBDRIVER_BIN, ['update', ...defaultArgs, ...webdriverManagerArgs], { stdio: 'inherit' });
  // }

  await execa(PROTRACTOR_BIN, [configPath], { stdio: 'inherit' });
};
