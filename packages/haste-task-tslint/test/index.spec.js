const fs = require('fs');
const tslint = require('../src');

const validFilename = require.resolve('./fixtures/valid.ts');
const invalidFilename = require.resolve('./fixtures/invalid.ts');

describe('haste-tslint', () => {
  it('should resolve for valid files', () => {
    const task = tslint();

    const file = {
      filename: validFilename,
      content: fs.readFileSync(validFilename, 'utf-8'),
    };

    return task([file]);
  });

  it('should reject for valid files', () => {
    expect.assertions(1);

    const task = tslint();

    const file = {
      filename: invalidFilename,
      content: fs.readFileSync(invalidFilename, 'utf-8'),
    };

    return task([file])
      .catch((error) => {
        expect(error).toMatch('Calls to \'console.error\' are not allowed');
      });
  });
});
