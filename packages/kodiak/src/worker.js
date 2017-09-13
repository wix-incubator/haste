const error = err => process.send({ type: 'error', err });
const send = message => process.send({ type: 'custom', message });
const listen = callback => process.on('message', callback);

process.on('message', (message) => {
  switch (message.type) {
    case 'init': {
      require(message.modulePath)(message.options, { send, listen })
        .then(({ idle } = {}) => idle ?
          process.send({ type: 'idle' }) :
          process.send({ type: 'complete' })
        )
        .catch(error);

      break;
    }
    default:
      break;
  }
});
