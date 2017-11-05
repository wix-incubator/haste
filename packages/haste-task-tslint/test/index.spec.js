const fs = require('fs');
const tslint = require('../src');

const pathToValidFile = require.resolve('./fixtures/valid.ts');
const pathToInvalidFile = require.resolve('./fixtures/invalid.ts');
const pathToConfiguration = require.resolve('./fixtures/tslint.json');

describe('haste-tslint', () => {
  it('should resolve for valid files', () => {
    const task = tslint({
      configurationFilePath: pathToConfiguration,
    });

    const file = {
      filename: pathToValidFile,
      content: fs.readFileSync(pathToValidFile, 'utf-8'),
    };

    return task([file]);
  });

  it('should reject for valid files', () => {
    expect.assertions(1);

    const task = tslint({
      configurationFilePath: pathToConfiguration,
    });

    const file = {
      filename: pathToInvalidFile,
      content: fs.readFileSync(pathToInvalidFile, 'utf-8'),
    };

    return task([file])
      .catch((error) => {
        expect(error).toMatch('Calls to \'console.error\' are not allowed');
      });
  });

  it('should reject if a tsconfig.json could not be found', () => {
    expect.assertions(1);

    const task = tslint({
      configurationFilePath: 'no-file',
    });

    const file = {
      filename: pathToValidFile,
      content: fs.readFileSync(pathToValidFile, 'utf-8'),
    };

    return task([file])
      .catch((error) => {
        expect(error.message).toMatch('Could not find config file');
      });
  });


  it('should pass configuration to the linter', () => {
    expect.assertions(1);

    const task = tslint({
      options: { formatter: 'verbose' },
      configurationFilePath: pathToConfiguration,
    });

    const file = {
      filename: pathToInvalidFile,
      content: fs.readFileSync(pathToInvalidFile, 'utf-8'),
    };

    return task([file])
      .catch((error) => {
        expect(error).toMatch('ERROR: (no-console)');
      });
  });
});
