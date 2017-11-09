const path = require('path');
const resolveFrom = require('resolve-from');

const HASTE_PRESET_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-preset-)/;

const standardizePresetName = module.exports.standardizePresetName = (name) => {
  // example -> haste-preset-example
  return name.replace(HASTE_PRESET_PREFIX_REGEX, 'haste-preset-');
};
