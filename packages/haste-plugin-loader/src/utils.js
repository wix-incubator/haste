module.exports.delta = (start) => {
  const end = new Date();
  const time = end.getTime() - start.getTime();

  return [end, time];
};

module.exports.generateRunTitle = (tasks) => {
  if (tasks[0].name === 'read' && tasks[1].name === 'write') {
    return 'copy';
  }

  return tasks
    .filter(t => !['read', 'write'].includes(t.name))
    .map(task => task.name).join(',');
};
