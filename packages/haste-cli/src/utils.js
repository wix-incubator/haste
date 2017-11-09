const HASTE_PRESET_PREFIX_REGEX = /^(?!@|[^/]+\/|haste-preset-)/;

module.exports.standardizePresetName = (name) => {
  // example -> haste-preset-example
  return name.replace(HASTE_PRESET_PREFIX_REGEX, 'haste-preset-');
};
