// @flow
module.exports.asyncToCallback = (f: Function) =>
  (data: any, callback: (?Error, any) => Promise<any>) =>
    f(data)
      .then(result => callback(null, result))
      .catch(error => callback(error));
