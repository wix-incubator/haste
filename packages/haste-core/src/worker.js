const Tapable = require('tapable');
const uuid = require('uuid/v4');
const EventEmitter = require('events');

class TaskEmitter extends EventEmitter {
  constructor(value) {
    super();
    this.value = value;
  }
}

module.exports = class extends Tapable {
  constructor({ name, modulePath, child }) {
    super();

    this.name = name;
    this.modulePath = modulePath;
    this.child = child;
    this.taskEmitters = {};

    this.callbacks = {};

    this.child.on('message', ({ type, value, id }) => {
      switch (type) {
        case 'success': {
          if (this.taskEmitters[id]) {
            return this.taskEmitters[id].value = value;
          }

          this.taskEmitters[id] = new TaskEmitter(value);
          return this.callbacks[id].resolve(this.taskEmitters[id]);
        }

        case 'failure': {
          if (this.taskEmitters[id]) {
            return this.taskEmitters[id].value = value;
          }

          return this.callbacks[id].reject(value);
        }

        default:
          return this.taskEmitters[id] && this.taskEmitters[id].emit(type, value);
      }
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
