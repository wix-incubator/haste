function parseError(error) {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, {});
}

async function execute({ options }) {
  const worker = {
    idle: (result) => {
      process.send({ type: 'PARENT_MESSAGE_IDLE', result });
    },
    complete: (result) => {
      process.send({ type: 'PARENT_MESSAGE_COMPLETE', result });
    },
    error: (error) => {
      if (error instanceof Error) {
        error = parseError(error); // eslint-disable-line no-param-reassign
      }

      if (error) {
        console.log(error.stack || error);
      }

      process.send({ type: 'PARENT_MESSAGE_ERROR', error });
    },
  };

  try {
    const result = require(process.argv[2])(options, { worker });

    if (result instanceof Promise) {
      result
        .then(worker.complete)
        .catch(worker.error);
    }
  } catch (error) {
    worker.error(error);
  }
}

process.on('message', ({ type, options }) => {
  console.log(process.argv[2], process.pid);

  switch (type) {
    case 'CHILD_MESSAGE_CALL':
      execute({ options });
      break;

    default:
      throw new TypeError('Unexpected request from parent process');
  }
});

process.on('uncaughtException', (error) => {
  handleError(error);
});
