const Tapable = require('tapable');
const { Observable } = require('rxjs');

module.exports = class extends Tapable {
  constructor({ name, modulePath, options, child }) {
    super();

    this.name = name;
    this.modulePath = modulePath;
    this.options = options;
    this.child = child;

    this.stream = Observable.fromEvent(child, 'message');

    this.complete = this.stream
      .find(({ type }) => ['complete', 'error', 'idle'].includes(type))
      .toPromise();

    this.end = this.stream
      .find(({ type }) => ['complete', 'error'].includes(type))
      .toPromise();
  }

  send(message) {
    this.child.send(message);
  }
};
