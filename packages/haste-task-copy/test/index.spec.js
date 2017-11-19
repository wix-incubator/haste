const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const mkdirp = require('mkdirp');
const copy = require('../src');

describe('haste-copy', () => {
  let projectDir;
  const target = 'statics';

  const copyToProject = (from, to) => {
    const dest = path.join(projectDir, to);
    mkdirp.sync(path.dirname(dest));
    fs.copyFileSync(from, dest);
  };

  beforeEach(() => {
    projectDir = tempy.directory();
  });

  it('should copy files into target directory using absolute target path', async () => {
    const file = { filename: 'file.txt', cwd: projectDir };
    const sourcePath = require.resolve(`./fixtures/${file.filename}`);
    const absoluteTargetPath = path.join(projectDir, target);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');

    copyToProject(sourcePath, file.filename);

    const task = copy({ target: absoluteTargetPath, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should copy files into target directory using relative target path', async () => {
    const file = { filename: 'file.txt', cwd: projectDir };
    const sourcePath = require.resolve(`./fixtures/${file.filename}`);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');

    copyToProject(sourcePath, file.filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should copy binary files', async () => {
    const file = { filename: 'logo.png', cwd: projectDir };
    const sourcePath = require.resolve(`./fixtures/${file.filename}`);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');

    copyToProject(sourcePath, file.filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should copy a file and create the directory structure if it does not exist', async () => {
    const filename = './fixtures/logo.png';
    const file = { filename, cwd: projectDir };
    const sourcePath = require.resolve(filename);
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');

    copyToProject(sourcePath, filename);

    const task = copy({ target, cwd: projectDir });

    await task([file]);

    const result = fs.readFileSync(path.join(projectDir, target, file.filename), 'utf8');

    expect(result).toEqual(sourceContent);
  });

  it('should throw an error if the source file does not exist', async () => {
    expect.assertions(1);

    const task = copy({ target, cwd: projectDir });
    const file = { filename: 'does/not/exists/file.txt', cwd: projectDir };

    try {
      await task([file]);
    } catch (error) {
      expect(error.code).toEqual('ENOENT');
    }
  });
});
