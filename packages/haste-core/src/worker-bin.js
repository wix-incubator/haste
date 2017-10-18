function parseError(error) {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, {});
}


process.on('message', ({ options = {}, input, id }) => {
  const emitEvent = (eventName, value) => {
    process.send({ type: eventName, value, id });
  };

  const handleError = (error) => {
    if (error instanceof Error) {
      error = parseError(error); // eslint-disable-line no-param-reassign
    }

    if (error) {
      console.log(error.stack || error);
    }

    emitEvent('failure', error);
  };

  let promise;

  try {
    promise = require(process.argv[2])(options, emitEvent)(input)
      .then(result => emitEvent('success', result));
  } catch (error) {
    handleError(error);
  }

  promise
    .catch(handleError);
});
