module.exports.parseError = (error) => {
  return Object.getOwnPropertyNames(error).reduce((obj, key) => {
    return Object.assign(obj, { [key]: error[key] });
  }, new Error(error.message));
};
