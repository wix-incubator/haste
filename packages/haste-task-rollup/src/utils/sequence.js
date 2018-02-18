// NOTE: copied from https://github.com/rollup/rollup/blob/82fe34dfe39d6c2aea9ca32444ea4a68e3afe814/bin/src/utils/sequence.ts
function sequence(array, fn) {
  const results = [];
  let promise = Promise.resolve();

  function next(member, i) {
    return fn(member).then((value) => {
      results[i] = value;
    });
  }

  for (let i = 0; i < array.length; i += 1) {
    promise = promise.then(() => next(array[i], i));
  }

  return promise.then(() => results);
}

module.exports = sequence;
