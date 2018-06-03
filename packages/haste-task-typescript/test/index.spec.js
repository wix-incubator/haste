const fs = require('fs');
const path = require('path');
const { setup } = require('haste-test-utils');
const { redColor, greenColor } = require('./utils');

const taskPath = require.resolve('../src');

const fromFixture = (filename) => {
  return fs.readFileSync(path.join(__dirname, filename), 'utf8');
};

const transpiledFixture = fromFixture('./expected/valid.transpiled.js');
const sourcemapFixture = fromFixture('./expected/valid.js.map').trim();

describe('haste-task-typescript', () => {
  let test;

  afterEach(() => test.cleanup());

  it('should transpile with typescript and resolve', async () => {
    test = await setup({
      'tsconfig.json': fromFixture('./fixtures/tsconfig.json'),
      'src/valid.ts': fromFixture('./fixtures/valid.ts'),
    });

    await test.run(async ({ [taskPath]: typescript }) => {
      await typescript({ project: test.cwd });
    });

    expect(test.files['dist/valid.js'].content).toEqual(transpiledFixture);
  });

  it('should generate sourcemaps when the sourceMap options is passed', async () => {
    test = await setup({
      'tsconfig.json': fromFixture('./fixtures/tsconfig.json'),
      'src/valid.ts': fromFixture('./fixtures/valid.ts'),
    });

    await test.run(async ({ [taskPath]: typescript }) => {
      await typescript({ project: test.cwd, sourceMap: true });
    });

    expect(test.files['dist/valid.js'].content).toMatch(transpiledFixture);
    expect(test.files['dist/valid.js'].content).toMatch('//# sourceMappingURL=valid.js.map');
    expect(test.files['dist/valid.js.map'].content).toMatch(sourcemapFixture);
  });

  it('should reject if typescript fails with errors', async () => {
    expect.assertions(3);

    test = await setup({
      'tsconfig.json': fromFixture('./fixtures/tsconfig.json'),
      'src/invalid.ts': fromFixture('./fixtures/invalid.ts'),
    });

    await test.run(async ({ [taskPath]: typescript }) => {
      try {
        await typescript({ project: test.cwd, sourceMap: true });
      } catch (error) {
        expect(test.stdio.stderr).toMatch('error TS2304: Cannot find name');
        expect(test.stdio.stderr).toMatch(redColor);
        expect(error.message).toMatch('tsc exited with code 2');
      }
    });
  });

  describe('watch', () => {
    it('should resolve after typescript has succeed', async () => {
      test = await setup({
        'tsconfig.json': fromFixture('./fixtures/tsconfig.json'),
        'src/valid.ts': fromFixture('./fixtures/valid.ts'),
      });

      await test.run(async ({ [taskPath]: typescript }) => {
        await typescript({ project: test.cwd, watch: true });
      });

      expect(test.stdio.stdout).toMatch('Found 0 errors. Watching for file changes.');
      expect(test.stdio.stdout).toMatch(greenColor);
      expect(test.files['dist/valid.js'].content).toEqual(transpiledFixture);
    });

    it('should resolve despite typescript has failed', async () => {
      test = await setup({
        'tsconfig.json': fromFixture('./fixtures/tsconfig.json'),
        'src/invalid.ts': fromFixture('./fixtures/invalid.ts'),
      });

      await test.run(async ({ [taskPath]: typescript }) => {
        await typescript({ project: test.cwd, watch: true });
      });

      expect(test.stdio.stderr).toMatch('error TS2304: Cannot find name');
      expect(test.stdio.stderr).toMatch('Found 1 error. Watching for file changes.');
      expect(test.stdio.stderr).toMatch(redColor);
    });
  });
});
