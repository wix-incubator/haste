const { standardizeTaskName } = require('../src/utils.js');

describe('standardizeTaskName', () => {
  it('should add "kodiak-task-" if needed', () => {
    expect(standardizeTaskName('example')).toEqual('kodiak-task-example');
  });
});
