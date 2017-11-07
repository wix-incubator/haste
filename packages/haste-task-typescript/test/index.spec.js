const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const { run } = require('haste-test-utils');
const { redColor, greenColor } = require('./utils');

const { command: typescript, kill } = run(require.resolve('../src'));
const configPath = require.resolve('./fixtures/tsconfig.json');
const transpiledFixture = fs.readFileSync(require.resolve('./expected/valid.transpiled'), 'utf-8');
const sourcemapFixture = fs.readFileSync(require.resolve('./expected/valid.js.map'), 'utf-8');

jest.setTimeout(30000);

describe('haste-task-typescript', () => {
  afterEach(kill);
  let projectDir;
  let outDir;
  const copyToProject = (from, to) => fs.copySync(require.resolve(from), path.join(projectDir, to));

  beforeEach(() => {
    projectDir = tempy.directory();
    outDir = path.join(projectDir, 'dist');
    fs.copySync(configPath, path.join(projectDir, 'tsconfig.json'));
  });

  it('should transpile with typescript and resolve', async () => {
    copyToProject('./fixtures/valid.ts', 'src/valid.ts');

    const outFile = path.join(outDir, 'valid.js');

    const { task } = typescript({ project: projectDir });

    await task();

    const outFileContent = fs.readFileSync(outFile, 'utf-8');

    expect(outFileContent).toEqual(transpiledFixture);
  });

  it('should generate sourcemaps when the sourceMap options is passed', async () => {
    copyToProject('./fixtures/valid.ts', 'src/valid.ts');
    const outFile = path.join(outDir, 'valid.js');
    const sourceMapFile = path.join(outDir, 'valid.js.map');

    const { task } = typescript({ project: projectDir, sourceMap: true });

    await task();

    const outFileContent = fs.readFileSync(outFile, 'utf-8');
    const sourceMapContent = fs.readFileSync(sourceMapFile, 'utf-8');

    expect(outFileContent).toMatch(transpiledFixture);
    expect(outFileContent).toMatch('//# sourceMappingURL=valid.js.map');
    expect(sourcemapFixture).toMatch(sourceMapContent);
  });

  it('should reject if typescript fails with errors', async () => {
    expect.assertions(3);

    copyToProject('./fixtures/invalid.ts', 'src/invalid.ts');

    const { task, stderr } = typescript({ project: projectDir });

    try {
      await task();
    } catch (error) {
      expect(stderr()).toMatch('error TS2304: Cannot find name');
      expect(stderr()).toMatch(redColor);
      expect(error).toBe(undefined);
    }
  });

  describe('watch', () => {
    it('should resolve after typescript has succeed', async () => {
      copyToProject('./fixtures/valid.ts', 'src/valid.ts');
      const outFile = path.join(outDir, 'valid.js');

      const { task, stdout } = typescript({ project: projectDir, watch: true });

      await task();

      expect(stdout()).toMatch('Compilation complete. Watching for file changes.');
      expect(stdout()).toMatch(greenColor);
      expect(fs.readFileSync(outFile, 'utf-8')).toEqual(transpiledFixture);
    });

    it('should resolve despite typescript has failed', async () => {
      copyToProject('./fixtures/invalid.ts', 'src/invalid.ts');

      const { task, stderr } = typescript({ project: projectDir, watch: true });

      await task();

      expect(stderr()).toMatch('error TS2304: Cannot find name');
      expect(stderr()).toMatch(redColor);
    });
  });
});
