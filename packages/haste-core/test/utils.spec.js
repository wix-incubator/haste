const { standardizeTaskName } = require('../src/utils.js');

describe('standardizeTaskName', () => {
  it('should add "haste-task-" if needed', () => {
    expect(standardizeTaskName('example')).toEqual('haste-task-example');
  });
});
