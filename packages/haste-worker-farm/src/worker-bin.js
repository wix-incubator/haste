const { PARENT_MESSAGE_OK, PARENT_MESSAGE_ERROR, CHILD_MESSAGE_CALL } = require('./constants');

function parseError(error) {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, {});
}

function handleError(error) {
  if (error instanceof Error) {
    error = parseError(error); // eslint-disable-line no-param-reassign
  }

  if (error) {
    console.log(error.stack || error);
  }

  process.send({ type: PARENT_MESSAGE_ERROR, error });
}

function handleResult(result) {
  process.send({ type: PARENT_MESSAGE_OK, result });
}

async function execute({ options }) {
  try {
    handleResult(await require(process.argv[2])(options));
  } catch (error) {
    handleError(error);
  }
}

process.on('message', ({ type, options }) => {
  console.log(process.argv[2], process.pid);

  switch (type) {
    case CHILD_MESSAGE_CALL:
      execute({ options });
      break;

    default:
      throw new TypeError('Unexpected request from parent process');
  }
});
