const path = require('path');
const resolveFrom = require('resolve-from');

const HASTE_PLUGIN_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-task-)/;

module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);

const standardizeTaskName = module.exports.standardizeTaskName = (name) => {
  // example -> haste-task-example
  return name.replace(HASTE_PLUGIN_PREFIX_REGEX, 'haste-task-');
};

module.exports.resolveTaskName = (taskName, runContext) => {
  if (path.isAbsolute(taskName)) {
    return taskName;
  }

  return resolveFrom(runContext, standardizeTaskName(taskName));
};
