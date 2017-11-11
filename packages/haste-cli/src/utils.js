const path = require('path');
const importFrom = require('import-from');

const HASTE_PRESET_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-preset-)/;

module.exports.standardizePresetName = (name) => {
  // example -> haste-preset-example
  return name.replace(HASTE_PRESET_PREFIX_REGEX, 'haste-preset-');
};

module.exports.resolvePresetName = (name) => {
  if (path.isAbsolute(name)) {
    return name;
  }

  return module.exports.standardizePresetName(name);
};

module.exports.loadConfig = (appDirectory) => {
  const packageJson = importFrom.silent(appDirectory, './package.json');

  if (!packageJson) {
    return null;
  }

  const { haste } = packageJson;

  if (!haste) {
    return null;
  }

  return haste;
};
