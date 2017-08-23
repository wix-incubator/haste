// @flow
const Tapable = require('tapable');

export default class extends Tapable {
  constructor({ module, options, context }: {module: string, options: Object, context: string }) {
    super();

    this.module = module;
    this.options = options;
    this.context = context;
  }
}
