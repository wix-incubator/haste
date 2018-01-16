const fs = require('haste-service-fs');
const serializeError = require('serialize-error');

let api = null;
let modulePath = null;

process.on('uncaughtException', handleError);

process.on('message', ({ type, options }) => {
  switch (type) {
    case 'CHILD_MESSAGE_INITIALIZE':
      modulePath = options.modulePath;
      break;

    case 'CHILD_MESSAGE_CALL':
      execute({ options });
      break;

    case 'CHILD_MESSAGE_API':
      executeApi({ options });
      break;

    case 'CHILD_MESSAGE_KILL':
      process.exit(0);
      break;

    default:
      throw new TypeError('Unexpected request from parent process');
  }
});

function handleError(error) {
  if (error) {
    console.error(error.stack || error);
  }

  if (!(error instanceof Error)) {
    error = new Error(error);
  }

  process.send({
    type: 'PARENT_MESSAGE_ERROR',
    error: serializeError(error),
  });
}

async function execute({ options }) {
  let result;

  try {
    result = await require(modulePath)(options, { fs });
  } catch (error) {
    return handleError(error);
  }

  if (result) {
    api = result;

    return process.send({
      type: 'PARENT_MESSAGE_IDLE',
      result: Object.keys(api),
    });
  }

  return process.send({
    type: 'PARENT_MESSAGE_COMPLETE',
  });
}

async function executeApi({ options: { name, args, callId } }) {
  try {
    const result = await api[name](...args);

    process.send({
      type: 'PARENT_MESSAGE_API',
      options: {
        callId,
      },
      result,
    });
  } catch (error) {
    process.send({
      type: 'PARENT_MESSAGE_API',
      options: {
        callId,
      },
      error: serializeError(error),
    });
  }
}
