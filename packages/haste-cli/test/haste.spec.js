const path = require('path');
const execa = require('execa');

const HASTE_BIN = require.resolve('../bin/haste');

function run({ command, presetPath }) {
  return execa(process.execPath, [HASTE_BIN, command], {
    cwd: path.join(__dirname, presetPath),
  });
}

describe('haste-cli', () => {
  it('should run with the preset that supllied as an --preset command line argument', async () => {
    const result = await execa(process.execPath, [HASTE_BIN, 'build', '--preset', 'haste-preset-basic'], {
      cwd: path.join(__dirname, './fixtures/cli-configured'),
    });

    expect(result.stdout).toMatch(/running build.../);
  });

  it('should run with the preset that supllied as an -p command line argument', async () => {
    const result = await execa(process.execPath, [HASTE_BIN, 'build', '-p', 'haste-preset-basic'], {
      cwd: path.join(__dirname, './fixtures/cli-configured'),
    });

    expect(result.stdout).toMatch(/running build.../);
  });

  it('should throw if no "preset" field is found in command/config', async () => {
    expect.assertions(2);

    try {
      await run({ presetPath: './fixtures/no-preset-field', command: 'build' });
    } catch (error) {
      expect(error.code).toEqual(1);
      expect(error.message).toMatch(/you must pass a preset/);
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
