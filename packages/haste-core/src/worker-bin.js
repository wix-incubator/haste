function parseError(error) {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, {});
}

process.on('message', ({ options, input, id }) => {
  const handleError = (error) => {
    if (error instanceof Error) {
      error = parseError(error); // eslint-disable-line no-param-reassign
    }

    if (error) {
      console.log(error.stack || error);
    }

    process.send({ type: 'failure', error, id });
  };

  let promise;

  try {
    promise = require(process.argv[2])(options)(input)
      .then(result => process.send({ type: 'success', result, id }));
  } catch (error) {
    handleError(error);
  }

  promise
    .catch(handleError);
});
