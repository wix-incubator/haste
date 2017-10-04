const Tapable = require('tapable');
const uuid = require('uuid/v1');

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

    const promise = new Promise((resolve, reject) =>
      this.child.on('message', ({ result, error, id }) => {
        if (id === callId) {
          error ? reject(error) : resolve(result);
        }
      })
    );

    return promise;
  }
};
