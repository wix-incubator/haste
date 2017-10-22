const task = require(process.argv[2]);

process.on('message', ({ options = {}, input }) => {
  task(options)(input)
    .then((result = {}) => process.send({ result }))
    .catch((error = {}) => process.send({ error }));
});
