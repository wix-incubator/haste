const path = require('path');
const resolveFrom = require('resolve-from');

const HASTE_TASK_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-task-)/;

const standardizeTaskName = (name) => {
  return camelCaseToDash(
    name.replace(HASTE_TASK_PREFIX_REGEX, 'haste-task-'),
  );
};

const camelCaseToDash = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const isPath = str => path.basename(str) !== str;

module.exports.resolveTaskName = (taskName, runContext) => {
  if (path.isAbsolute(taskName)) {
    try {
      return require.resolve(taskName);
    } catch (error) {
      throw new Error(`Cannot resolve task ${taskName}`);
    }
  }

  const resolvedTaskName = !isPath(taskName) ? standardizeTaskName(taskName) : taskName;

  try {
    return resolveFrom(runContext, resolvedTaskName);
  } catch (error) {
    throw new Error(`Cannot resolve task ${taskName} in ${runContext}`);
  }
};

module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);
