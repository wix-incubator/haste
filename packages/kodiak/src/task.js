const Tapable = require('tapable');
const { Observable } = require('rxjs');
const { streamToPromise } = require('./utils');

module.exports = class extends Tapable {
  constructor({ module, options, child }) {
    super();

    this.module = module;
    this.options = options;
    this.child = child;

    this.stream = Observable.fromEvent(child, 'message');

    this.result = streamToPromise(
      this.stream.find(({ type }) => ['complete', 'error', 'idle'].includes(type))
    );

    this.done = streamToPromise(
      this.stream.find(({ type }) => ['complete', 'error'].includes(type))
    );
  }

  send(message) {
    this.child.send(message);
  }
};
