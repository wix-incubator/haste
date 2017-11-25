const os = require('os');
const Tapable = require('tapable');
const { Farm, Pool } = require('haste-worker-farm');
const { resolveTaskName } = require('./utils');

module.exports = class Runner extends Tapable {
  constructor() {
    super();

    this.farm = new Farm({ maxConcurrentCalls: os.cpus().length });
  }

  define(action, { persistent = false } = {}) {
    return async ({ context }) => {
      const tasks = new Proxy({}, {
        get: (target, name) => {
          const modulePath = resolveTaskName(name, context);
          const pool = new Pool({ farm: this.farm, modulePath });

          this.applyPlugins('create-pool', pool);

          return async (options) => {
            return pool.send({ options })
              .catch((error) => {
                if (!persistent) {
                  throw error;
                }
              });
          };
        }
      });

      const result = await action(tasks);

      return { persistent, result };
    };
  }
};
