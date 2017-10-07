const Tapable = require('tapable');
const uuid = require('uuid/v4');

module.exports = class extends Tapable {
  constructor({ name, modulePath, child }) {
    super();

    this.name = name;
    this.modulePath = modulePath;
    this.child = child;

    this.callbacks = {};

    this.child.on('message', ({ type, result, error, id }) => {
      return type === 'failure' ?
        this.callbacks[id].reject(error) :
        this.callbacks[id].resolve(result);
    });
  }

  run(options, input) {
    const id = uuid();

    this.child.send({ options, input, id });

    const promise = new Promise((resolve, reject) => {
      this.callbacks[id] = { resolve, reject };
    });

    return promise;
  }
};
