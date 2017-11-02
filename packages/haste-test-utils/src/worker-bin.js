const task = require(process.argv[2]);

process.on('message', ({ options = {}, input, id }) => {
  task(options)(input)
    .then(result => process.send({ id, result, type: 'success' }))
    .catch((error) => {
      if (error) {
        console.log(error);
      }

      process.send({ id, error, type: 'failure' });
    });
});
