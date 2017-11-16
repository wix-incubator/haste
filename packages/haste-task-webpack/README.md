# haste-task-webpack
webpack wrapper for haste runner.

## options

#### configPath

Type: `string`

Path to a webpack config, the config can be a javascript object or a function that accepts an object of config params and return an object.

```js
// ./webpack.config.js

module.exports = {
  entry: './index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js',
  }
};
```

Useful when you want to build your webpack config dynamically using cli arguments or configuration from the preset.

```js
// ./webpack.config.function.js

module.exports = configParams => ({
  entry: configParams.entry,
  output: {
    path: 'dist',
    filename: 'bundle.js',
  }
});
```

#### callbackPath

Type: `string`

Path to a callback that accepts webpack err and stats, for example:

```js
module.exports = (err, stats) => {
  console.log(stats.toString('minimal'));
};
```

#### configParams

Type: `object`

An object that will be passed to the config function in case it is actually a function.

```js
// ./preset.js

webpack({ configPath: './webpack.config.function', configParams: { hey: 'oh'}});

// ./webpack.config.function.js

module.exports = configParams => {
  console.log(configParams.hey) // oh

  return ({
    entry: './index.js',
    output: {
      path: 'dist',
      filename: 'bundle.js',
    }
  })
};
```

#### watch

Type: `boolean`

Whether or not to run Webpack in watch mode, defaults to false.

#### watchOptions

Type: `object`

Watch options for webpack, see [webpack documentation](https://webpack.js.org/api/node/#watching) for the full list of available options.
