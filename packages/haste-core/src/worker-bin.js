const task = require(process.argv[2]);

function parseError(error) {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, {});
}

process.on('message', ({ options, input, id }) => {
  task(options)(input)
    .then(result => process.send({ result, id }))
    .catch((error) => {
      if (error instanceof Error) {
        error = parseError(error); // eslint-disable-line no-param-reassign
      }

      console.log(error.stack || error);

      process.send({ error, id });
    });
});
