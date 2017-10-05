const Tapable = require('tapable');
const uuid = require('uuid/v4');

module.exports = class extends Tapable {
  constructor({ name, modulePath, child }) {
    super();

    this.name = name;
    this.modulePath = modulePath;
    this.child = child;
  }

  run(options, input) {
    const callId = uuid();

    this.child.send({ options, input, id: callId });
    const promise = new Promise((resolve, reject) => {
      const handler = ({ result, error, id }) => {
        if (id === callId) {
          this.child.removeListener('message', handler);
          error ? reject(error) : resolve(result);
        }
      };

      this.child.on('message', handler);
    });

    return promise;
  }
};
