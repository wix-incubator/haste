---
id: preset
title: Preset
sidebar_label: Preset
---

## What is a preset?
A preset is an object that maps user actions (cli commands) to async functions.
Those async functions are called **commands**.
Each command, initializes a runner and uses it execute tasks.

**Tasks** are modules that usualy perform a side effect like transpiling code, linting, running webpack etc.

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

First we start by creating a runner, and using it to create a command.
The command accepts an async function. Use the `tasks` argument To call your tasks.

## The tasks object
A utility object, when you call `tasks.build()` it will search for `haste-task-build` in your `node_modules`, it will load it and run it on a different process.

**NOTE:** You can also run a local task using `tasks['./path/to/local/task.js']`.

> Wondering how this magic object is implemented? Read about [Proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Lets give our preset a try
Create an `src` directory and a `file.js` in it.
you'll see something that looks like this.

```
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

You should be able to see a `dist` folder with the transpiled file.

Horray! 👏
Youv'e create your first preset.

## What's next?

* add commands (test/lint/start)
* add plugins
* share your preset
