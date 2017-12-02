const path = require('path');
const resolveFrom = require('resolve-from');

const HASTE_TASK_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-task-)/;

const standardizeTaskName = (name) => {
  return name.replace(HASTE_TASK_PREFIX_REGEX, 'haste-task-');
};

const camelCaseToDash = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const isPath = str => path.basename(str) !== str;

module.exports.resolveTaskName = (taskName, runContext) => {
  if (path.isAbsolute(taskName)) {
    return taskName;
  }

  taskName = isPath(taskName) ? taskName : standardizeTaskName(camelCaseToDash(taskName));

  return resolveFrom(runContext, taskName);
};

module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);
