const task = require(process.argv[2]);

process.on('message', ({ options = {}, input, id }) => {
  task(options)(input)
    .then((result = {}) => process.send({ result, id }))
    .catch((error = {}) => process.send({ error, id }));
});
