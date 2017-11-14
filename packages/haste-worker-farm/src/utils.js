const path = require('path');
const resolveFrom = require('resolve-from');

const HASTE_TASK_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-task-)/;

const standardizeTaskName = (name) => {
  return name.replace(HASTE_TASK_PREFIX_REGEX, 'haste-task-');
};

module.exports.resolveTaskName = (taskName, runContext) => {
  if (path.isAbsolute(taskName)) {
    return taskName;
  }

  return resolveFrom(runContext, standardizeTaskName(taskName));
};
