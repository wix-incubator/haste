module.exports = (concurrency) => {
  const queue = [];
  let size = 0;

  function processQueue() {
    if (queue.length === 0) {
      return Promise.resolve();
    }

    if (size >= concurrency) {
      return Promise.resolve();
    }

    const task = queue.shift();

    size += 1;

    return task()
      .then(() => size -= 1)
      .then(() => processQueue());
  }

  return {
    push: (task) => {
      const promise = Promise.resolve()
        .then(() => queue.push(task));

      promise
        .then(() => processQueue());

      return promise;
    }
  };
};
