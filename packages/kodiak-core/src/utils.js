const path = require('path');
const resolveFrom = require('resolve-from');

const KODIAK_PLUGIN_PREFIX_REGEX = /^(?!@|[^/]+\/|kodiak-task-)/;

module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);

const standardizeTaskName = module.exports.standardizeTaskName = (name) => {
  // example -> kodiak-task-example
  return name.replace(KODIAK_PLUGIN_PREFIX_REGEX, 'kodiak-task-');
};

module.exports.resolveTaskName = (taskName, runContext) => {
  if (path.isAbsolute(taskName)) {
    return taskName;
  }

  return resolveFrom(runContext, standardizeTaskName(taskName));
};
