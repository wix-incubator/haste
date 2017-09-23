const task = require(process.argv[2]);

process.on('message', ({ options }) => {
  task(options)
    .then(result => process.send({ result }))
    .catch(error => process.send({ error }));
});
