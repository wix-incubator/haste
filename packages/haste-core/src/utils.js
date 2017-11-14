const path = require('path');

module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);

module.exports.camelCaseToDash = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

module.exports.isPath = str => path.basename(str) !== str;
