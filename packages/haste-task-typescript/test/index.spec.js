const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const typescript = require('../src');
const config = require('./fixtures/tsconfig.json');

const configPath = require.resolve('./fixtures/tsconfig.json');
const projectDir = path.dirname(configPath);
const outDir = path.join(projectDir, config.compilerOptions.outDir);
const outFile = path.join(outDir, 'app.js');
const transpiledFileFixture = fs.readFileSync(require.resolve('./fixtures/app.transpiled')).toString();

describe('haste-task-typescript', () => {
  afterEach(() => {
    rimraf.sync(outDir);
  });

  it('should transpile with typescript', () => {
    const task = typescript({ project: projectDir });

    return task()
      .then(() => {
        expect(fs.existsSync(outFile)).toEqual(true);
        expect(fs.readFileSync(outFile).toString()).toEqual(transpiledFileFixture);
      });
  });

  it('should reject if typescript fails with errors', async () => {
    // TODO
  });
});
