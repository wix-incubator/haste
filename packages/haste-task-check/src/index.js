const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const access = (filePath, mode) => new Promise((resolve, reject) =>
  fs.access(filePath, mode, err => err ? reject(err) : resolve())
);

module.exports = ({ files }) => {
  const promises = files.map(filePath => access(filePath, fs.F_OK));

  return Promise.all(promises)
    .catch((error) => {
      const dirName = path.dirname(error.path);
      const fileName = path.basename(error.path);

      console.log(chalk.red('Could not find a required file.'));
      console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
      console.log(chalk.red('  Searched in: ') + chalk.cyan(dirName));

      return Promise.reject();
    });
};
