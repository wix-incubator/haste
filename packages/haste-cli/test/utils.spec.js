const { standardizePresetName } = require('../src/utils');

describe('standardizePresetName', () => {
  it('should add "haste-preset-" if needed', () => {
    expect(standardizePresetName('example')).toEqual('haste-preset-example');
  });
});
