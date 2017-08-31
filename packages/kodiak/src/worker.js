const complete = () => process.send({ type: 'complete' });
const error = err => process.send({ type: 'error', err });
const idle = () => process.send({ type: 'idle' });

const send = message => process.send({ type: 'custom', message });
const listen = callback => process.on('message', callback);

process.on('message', (message) => {
  switch (message.type) {
    case 'init':
      require(message.module)({ complete, error, idle }, message.options, { send, listen });
      break;
    default:
      break;
  }
});
