---
id: preset
title: Preset
---

A preset is an object that maps user actions (cli commands) to async functions.
Those async functions are called **commands**.
Each command initializes a runner and uses it to execute tasks.

**Tasks** are modules that usually perform a side effect like transpiling code, linting, running webpack etc.

## How to write a preset?

install dependencies

```bash
npm i --save haste-core haste-cli haste-task-babel
```

or use yarn

```bash
yarn add haste-core haste-cli haste-task-babel
```

Create an `haste-preset-example.js` file:

```js
// haste-preset-example.js

const build = require('./build');

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
you'll see something that looks like this.

```bash
├── commands
│   └── build.js
├── haste-preset-example.js
├── package.json
└── src
    └── file.js
```

Now run the following command.
```bash
./node_modules/.bin/haste build -p ./haste-preset-example.js
```

> **Which actually means:** Use `haste-cli` binary file from the `node_modules` to run the build command of the preset `haste-preset-example.js`.

> you can also define it in your `package.json` and run `npm run build`.
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

After running the build command you should be able to see a `dist` directory with the transpiled `file.js`.

Horray! 👏
You've created your first preset.

## What's next?

* Add more commands (test/lint/start)
* Create a plugin
* Create a custom logger
* Share your preset
