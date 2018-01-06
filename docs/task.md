---
id: task
title: Task
---

An async function that does side effect, and may log it's results to the console.

The first object is the user argument provided from the preset, the second argument is an object with services injected to every task.

_See an example task:_

```js
const { transform } = require('babel-core');

const defaultOptions = {
  ast: false,
};

module.exports = async ({ pattern, target, ...options }, { fs }) => {
  const files = await fs.read({ pattern });

  return Promise.all(
    files
      .map(({ filename, content }) => {
        const { code, map } = transform(content, {
          ...defaultOptions,
          ...options,
          filename,
        });

        return fs.write({
          target,
          filename,
          content: code,
          map,
        });
      }),
  );
};
```
