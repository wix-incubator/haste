process.on('message', (data) => {
  const task = require(data.task);

  task()
    .then(() => process.send({ success: true }))
    .catch(() => process.send({ success: false }));
});
