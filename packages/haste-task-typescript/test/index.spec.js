const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const { run } = require('haste-test-utils');

const { command: typescript, kill } = run(require.resolve('../src'));

const configPath = require.resolve('./fixtures/tsconfig.json');
const transpiledFile = fs.readFileSync(require.resolve('./expected/valid.transpiled'), 'utf-8');

describe('haste-task-typescript', () => {
  afterEach(kill);
  let projectDir;
  let outDir;

  beforeEach(() => {
    projectDir = tempy.directory();
    fs.copySync(configPath, path.join(projectDir, 'tsconfig.json'));

    outDir = path.join(projectDir, 'dist');
  });

  it('should transpile with typescript and resolve', async () => {
    fs.copySync(require.resolve('./fixtures/valid.ts'), path.join(projectDir, 'src/valid.ts'));
    const outFile = path.join(outDir, 'valid.js');

    const { task, stdout } = typescript({ project: projectDir });

    await task();
    expect(fs.readFileSync(outFile, 'utf-8')).toEqual(transpiledFile);
    expect(stdout()).toMatch('');
  });

  it('should reject if typescript fails with errors', async () => {
    expect.assertions(2);

    fs.copySync(require.resolve('./fixtures/invalid.ts'), path.join(projectDir, 'src/invalid.ts'));
    const { task, stdout } = typescript({ project: projectDir });

    try {
      await task();
    } catch (error) {
      expect(stdout()).toMatch('error TS2304: Cannot find name');
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
      expect(fs.readFileSync(outFile, 'utf-8')).toEqual(transpiledFile);
    });

    it('should resolve despite typescript failure', async () => {
      fs.copySync(require.resolve('./fixtures/invalid.ts'), path.join(projectDir, 'src/invalid.ts'));
      const { task, stdout } = typescript({ project: projectDir, watch: true });
      await task();

      expect(stdout()).toMatch('error TS2304: Cannot find name');
    });
  });
});
