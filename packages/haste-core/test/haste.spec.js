const path = require('path');
const { setup } = require('haste-test-utils');

const resolveFromFixtures = name => path.join(__dirname, './fixtures', name);

const successfulPath = resolveFromFixtures('successful');
const unsuccessfulPath = resolveFromFixtures('unsuccessful');
const logOptionsPath = resolveFromFixtures('log-options');
const errorPath = resolveFromFixtures('error');
const requireErrorPath = resolveFromFixtures('require-error');
const nonAsyncPath = resolveFromFixtures('non-async');
const noErrorPath = resolveFromFixtures('no-error');
const errorOutsidePath = resolveFromFixtures('error-outside');
const idlePath = resolveFromFixtures('idle');

describe('haste', () => {
  let test;

  afterEach(() => test.cleanup());

  describe('running tasks', () => {
    it('should run a successful async task and resolve', async () => {
      test = await setup();

      await test.run(async ({ [successfulPath]: successful }) => {
        await successful();
      });

      expect(test.stdio.stdout).toMatch('successful');
    });

    it('should run a successful non-async task and resolve', async () => {
      test = await setup();

      await test.run(async ({ [nonAsyncPath]: nonAsync }) => {
        await nonAsync();
      });

      expect(test.stdio.stdout).toMatch('non-async');
    });

    it('should run an unsuccessful task and reject', async () => {
      expect.assertions(1);

      test = await setup();

      await test.run(async ({ [unsuccessfulPath]: unsuccessful }) => {
        try {
          await unsuccessful();
        } catch (error) {
          expect(error.message).toMatch('unsuccessful');
        }
      });
    });

    it('should reject an execution with an unsuccessful task', async () => {
      expect.assertions(1);

      test = await setup();

      try {
        await test.run(async ({ [unsuccessfulPath]: unsuccessful }) => {
          await unsuccessful();
        });
      } catch (error) {
        expect(error.message).toMatch('unsuccessful');
      }
    });

    it('should reject if a non async task threw an error', async () => {
      expect.assertions(1);

      test = await setup();

      try {
        await test.run(async ({ [errorPath]: error }) => {
          await error();
        });
      } catch (error) {
        expect(error.message).toMatch('error');
      }
    });

    it('should reject if a task throws an error when required', async () => {
      expect.assertions(1);

      test = await setup();

      try {
        await test.run(async ({ [requireErrorPath]: requireError }) => {
          await requireError();
        });
      } catch (error) {
        expect(error.message).toMatch('error');
      }
    });

    it('should reject if a task was rejected without any value', async () => {
      expect.assertions(1);

      test = await setup();

      try {
        await test.run(async ({ [noErrorPath]: noError }) => {
          await noError();
        });
      } catch (error) {
        expect(error.message).toMatch('Error in worker');
      }
    });

    it('should reject if a task threw an error outside if it\'s function invocation', async () => {
      expect.assertions(1);

      test = await setup();

      try {
        await test.run(async ({ [errorOutsidePath]: errorOutside }) => {
          await errorOutside();
        });
      } catch (error) {
        expect(error.message).toMatch('Error in worker');
      }
    });

    it('should reject if a task cannot be found as an absolute path', async () => {
      expect.assertions(1);

      const absolutePath = path.join(__dirname, './not-found');

      test = await setup();

      try {
        await test.run(async ({ [absolutePath]: notFound }) => {
          await notFound();
        });
      } catch (error) {
        expect(error.message).toMatch(`Cannot resolve task ${absolutePath}`);
      }
    });

    it('should reject if a task cannot be found as a relative path', async () => {
      expect.assertions(1);

      const context = path.join(__dirname, 'the-moon');
      const taskPath = './not-found';

      test = await setup();

      try {
        await test.run(async ({ [taskPath]: notFound }) => {
          await notFound();
        }, { context });
      } catch (error) {
        expect(error.message).toMatch(`Cannot resolve task ${taskPath} in ${context}`);
      }
    });

    it('should pass an options object to a task', async () => {
      const options = { hello: 'world' };

      test = await setup();

      await test.run(async ({ [logOptionsPath]: logOptions }) => {
        await logOptions(options);
      });

      expect(test.stdio.stdout).toMatch(JSON.stringify(options));
    });
  });

  describe.only('API of idle tasks', () => {
    it('should call the exposed api of the task', async () => {
      test = await setup();

      await test.run(async ({ [idlePath]: idle }) => {
        const api = await idle();
        expect(test.stdio.stdout).toMatch('idle');

        await api.log();
        expect(test.stdio.stdout).toMatch('log');
      });
    });

    it('should pass arguments to the exposed api of the task', async () => {
      test = await setup();

      const args = [1, 2, 3];

      await test.run(async ({ [idlePath]: idle }) => {
        const api = await idle();
        expect(test.stdio.stdout).toMatch('idle');

        await api.options(...args);
        expect(test.stdio.stdout).toMatch(args.join(' '));
      });
    });

    it('should resolve with the result if invoking the api method was successful', async () => {
      test = await setup();

      await test.run(async ({ [idlePath]: idle }) => {
        const api = await idle();
        expect(test.stdio.stdout).toMatch('idle');

        const result = await api.successful();
        expect(result).toMatch('successful');
      });
    });

    it('should reject with the error if invoking the api method was unsuccessful', async () => {
      expect.assertions(2);

      test = await setup();

      await test.run(async ({ [idlePath]: idle }) => {
        const api = await idle();
        expect(test.stdio.stdout).toMatch('idle');

        try {
          await api.unsuccessful();
        } catch (error) {
          expect(error.message).toMatch('unsuccessful');
        }
      });
    });
  });

  describe('run context', () => {
    it('should resolve a task relative to the run context', async () => {
      const options = {
        context: path.join(__dirname, '/fixtures'),
      };

      test = await setup();

      await test.run(async ({ './successful': successful }) => {
        await successful();
      }, options);

      expect(test.stdio.stdout).toMatch('successful');
    });

    it('should resolve a task relative to the run context when a full module name is supplied', async () => {
      const options = {
        context: path.join(__dirname, '/fixtures'),
      };

      test = await setup();

      await test.run(async ({ 'haste-task-successful': successful }) => {
        await successful();
      }, options);

      expect(test.stdio.stdout).toMatch('successful');
    });

    it('should resolve a task relative to the run context when a partial module name is supplied', async () => {
      const options = {
        context: path.join(__dirname, '/fixtures'),
      };

      test = await setup();

      await test.run(async ({ successful }) => {
        await successful();
      }, options);

      expect(test.stdio.stdout).toMatch('successful');
    });
  });
});
