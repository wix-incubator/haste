const path = require('path');
const { writeFile } = require('./utils');

module.exports = ({ filename, content, map, target }) => {
  const promises = [];
  const outFilename = path.join(target, filename);

  if (map) {
    const mapFilename = `${outFilename}.map`;

    if (typeof map === 'object') {
      map = JSON.stringify(map);
    }

    promises.push(writeFile(mapFilename, map));

    content += `\n//# sourceMappingURL=${path.basename(mapFilename)}`;
  }

  promises.push(
    writeFile(outFilename, content),
  );

  return Promise.all(promises);
};

