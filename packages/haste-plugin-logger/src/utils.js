module.exports.format = time => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

module.exports.delta = (start) => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};

module.exports.generateRunTitle = (tasks) => {
  const READ = 'read';
  const WRITE = 'write';
  const COPY = 'copy';

  // if there are two tasks which are "read" and "write" with no titles call it copy
  if (tasks.length === 2 && !tasks[0].metadata.title && !tasks[1].metadata.title) {
    if (tasks[0].name === READ && tasks[1].name === WRITE) {
      return COPY;
    }
  }

  return tasks
    // filter any "read"/"write" tasks that has no title
    .filter(task => task.metadata.title || ![READ, WRITE].includes(task.name))
    // try to use the title of a task if exist and default to the task name
    .map(task => task.metadata.title || task.name).join(',');
};
