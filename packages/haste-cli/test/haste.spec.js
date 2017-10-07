const path = require('path');
const execa = require('execa');

const HASTE_BIN = require.resolve('../bin/haste');

function run({ command, presetPath }) {
  return execa(process.execPath, [HASTE_BIN, command], {
    cwd: path.join(__dirname, presetPath),
  });
}

describe('haste-cli', () => {
  it('should throw if no config is found', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/empty', command: 'build' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/Can't find .hasterc or a "haste" field under package.json/);
    }
  });

  it('should throw if no "preset" field is found in config', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/no-preset-field', command: 'build' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/"preset" is a mandatory field/);
    }
  });

  it('should throw if requested preset was not found', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/preset-not-found', command: 'build' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/Cannot find module 'some-preset'/);
    }
  });

  it('should throw if requested preset is not supporting the command', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/basic', command: 'start' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/haste-preset-basic doesn't support command start/);
    }
  });

  it('should run a successful preset command and resolve', async () => {
    const result = await run({ presetPath: './fixtures/basic', command: 'build' });
    expect(result.stdout).toMatch(/running build.../);
  });

  it('should run an unsuccessful preset command and reject', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/basic', command: 'test' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/running test.../);
    }
  });
});
