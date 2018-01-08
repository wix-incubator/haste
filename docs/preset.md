---
id: preset
title: Preset
---

A preset is an object that maps user actions (cli commands) to async functions.
Those async functions are called **commands**.
Each command initializes a runner and uses it to execute tasks.

**Tasks** are modules that usually perform a side effect like transpiling code, linting, running webpack etc.

## How to write a preset?

Create an empty directory

```bash
mkdir haste-preset-example
```

Install haste core and cli dependencies

```bash
yarn add haste-core@next haste-cli@next
```

Install babel task and a preset to run it with

```bash
yarn add haste-task-babel@next babel-preset-env
```

Create an `haste-preset-example.js` file:

```js
// haste-preset-example.js

const build = require('./commands/build');

module.exports = {
  build
};
```

When the user will run `haste build` the **build command** will be executed.

## How to write a command

Create a `build.js` file in a `commands` directory.

```js
// commands/build.js

const { createRunner } = require('haste-core');

const runner = createRunner();

module.exports = runner.command(async (tasks) => {
    await tasks.babel({ pattern: 'src/**/*.js', target: 'dist' });
});
```

First, we start by creating a runner and using it to create a command.
The command accepts an async function. Use the `tasks` argument To call your tasks.

## The tasks object

A utility object, when you call `tasks.build()` it will search for `haste-task-build` in your `node_modules`, it will load it and run it on a different process.

**NOTE:** You can also run a local task using `tasks['./path/to/local/task.js']`.

> Wondering how this magic object is implemented? Read about [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Lets use our preset

Create an `src` directory and a `file.js` in it.

```js
// src/file.js
const hello = 'world';
```

you'll see something that looks like this.

```bash
├── commands
│   └── build.js
├── haste-preset-example.js
├── package.json
└── src
    └── file.js
```

Place the following in your `package.json`.

```json
{
  "scripts": {
    "build": "haste build"
  },
  "haste": {
    "preset": "./haste-preset-example.js"
  }
}
```

Now run:

```bash
npm run build
```

You should see a `dist` directory with the transpiled `file.js`.

```js
// dist/file.js
'use strict';

var hello = 'world';
```

```bash
├── commands
│   └── build.js
├── haste-preset-example.js
├── package.json
├── src
│   └── file.js
└── dist
    └── src
       └── file.js
```

Horray! 👏
You've created your first preset.

## What's next?

* Add more commands (test/lint/start)
* Share your preset
