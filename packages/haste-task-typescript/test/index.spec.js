const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const { run } = require('haste-test-utils');

const { command: typescript, kill } = run(require.resolve('../src'));
const configPath = require.resolve('./fixtures/tsconfig.json');
const transpiledFixture = fs.readFileSync(require.resolve('./expected/valid.transpiled'), 'utf-8');
const sourcemapFixture = fs.readFileSync(require.resolve('./expected/valid.js.map'), 'utf-8');

describe('haste-task-typescript', () => {
  afterEach(kill);
  let projectDir;
  let outDir;

  beforeEach(() => {
    projectDir = tempy.directory();
    outDir = path.join(projectDir, 'dist');
    fs.copySync(configPath, path.join(projectDir, 'tsconfig.json'));
  });

  it('should transpile with typescript and resolve', async () => {
    fs.copySync(require.resolve('./fixtures/valid.ts'), path.join(projectDir, 'src/valid.ts'));
    const outFile = path.join(outDir, 'valid.js');

    const { task, stdout } = typescript({ project: projectDir });

    await task();

    const outFileContent = fs.readFileSync(outFile, 'utf-8');

    expect(outFileContent).toEqual(transpiledFixture);
    expect(stdout()).toMatch('');
  });

  it('should generate sourcemaps when the sourceMap options is passed', async () => {
    fs.copySync(require.resolve('./fixtures/valid.ts'), path.join(projectDir, 'src/valid.ts'));
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

    fs.copySync(require.resolve('./fixtures/invalid.ts'), path.join(projectDir, 'src/invalid.ts'));

    const { task, stderr } = typescript({ project: projectDir });

    try {
      await task();
    } catch (error) {
      expect(stderr()).toMatch('error TS2304: Cannot find name');
      expect(stderr()).toMatch('\u001B[31m'); // has red color
      expect(error).toBe(undefined);
    }
  });

  describe('watch', () => {
    it('should resolve after transpiling has done', async () => {
      fs.copySync(require.resolve('./fixtures/valid.ts'), path.join(projectDir, 'src/valid.ts'));
      const outFile = path.join(outDir, 'valid.js');

      const { task, stdout } = typescript({ project: projectDir, watch: true });

      await task();

      expect(stdout()).toMatch('Compilation complete. Watching for file changes.');
      expect(stdout()).toMatch('\u001B[32m'); // has green color
      expect(fs.readFileSync(outFile, 'utf-8')).toEqual(transpiledFixture);
    });

    it('should resolve despite typescript failure', async () => {
      fs.copySync(require.resolve('./fixtures/invalid.ts'), path.join(projectDir, 'src/invalid.ts'));

      const { task, stderr } = typescript({ project: projectDir, watch: true });

      await task();

      expect(stderr()).toMatch('error TS2304: Cannot find name');
      expect(stderr()).toMatch('\u001B[31m'); // has red color
    });
  });
});
