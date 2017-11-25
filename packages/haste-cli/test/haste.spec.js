const path = require('path');
const execa = require('execa');

const HASTE_BIN = require.resolve('../bin/haste');

function run({ command = '', args = [], cwd } = {}) {
  return execa(process.execPath, [HASTE_BIN, command, ...args], { cwd });
}

const simplePresetPath = require.resolve('./fixtures/simple-preset');

describe.only('haste-cli', () => {
  expect.assertions(2);

  it('should fail if no command was passed', async () => {
    try {
      await run();
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch('You must specify a command for Haste to run');
    }
  });

  it('should fail if no preset was passed', async () => {
    expect.assertions(2);

    try {
      await run({
        command: 'build',
      });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch('You must pass a preset through cli option "--preset", .hasterc, or package.json configs');
    }
  });

  it('should fail if requested preset could not be found', async () => {
    expect.assertions(2);

    try {
      await run({
        command: 'build',
        args: ['--preset', 'no-preset'],
      });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch('Unable to find "no-preset", please make sure it is installed');
    }
  });

  it('should fail if requested preset does not support passed command', async () => {
    expect.assertions(2);

    try {
      await run({
        command: 'no-action',
        args: ['--preset', simplePresetPath],
      });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(`${simplePresetPath} doesn't support command "no-action"`);
    }
  });

  it('should fail if preset action failed', async () => {
    expect.assertions(2);

    try {
      await run({
        command: 'failing',
        args: ['--preset', simplePresetPath],
      });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch('Error: failing action');
    }
  });

  it('should resolve if preset action was successful', async () => {
    const result = await run({
      command: 'passing',
      args: ['--preset', simplePresetPath],
    });

    expect(result.stdout).toEqual('passing action');
  });

  it('should support passing relative preset name', async () => {
    const result = await run({
      command: 'passing',
      args: ['--preset', 'basic'],
      cwd: path.join(__dirname, './fixtures/basic'),
    });

    expect(result.stdout).toMatch('passing action');
  });

  it('should support passing preset name from package.json', async () => {
    const result = await run({
      command: 'passing',
      cwd: path.join(__dirname, './fixtures/basic-package-json'),
    });

    expect(result.stdout).toMatch('passing action');
  });
});
