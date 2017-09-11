module.exports.flatten = list => list.reduce((sub, elm) => sub.concat(elm), []);

module.exports.streamToPromise = stream => new Promise((resolve, reject) =>
  stream.subscribe(({ err }) => err ? reject(err) : resolve())
);
