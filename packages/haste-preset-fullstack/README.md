# Haste fullstack preset

A Haste preset that supports building fullstack react applications.

## Features

- Zero configuration required to start developing your app.
- Webpack config that includes loaders for importing scss, icons, fonts and graphql.
- Hot Module Replacement support in dev mode.
- Production optimized bundles with minification and scope hoisted modules for faster execution.
- Dashboard view while in dev mode to clearly see what is running.

## Requirements

- Node.js v6.10.0 or above
- Yarn or NPM

## Installation

With yarn:

```sh
$ yarn add --dev haste-cli haste-preset-fullstack
```

Or with npm:

```sh
$ npm install --save-dev haste-cli haste-preset-fullstack
```

## Quickstart

Edit your project's package.json and add commands for starting, building and testing your application:

```json
{
  "scripts": {
    "start": "haste start",
    "test": "haste test",
    "build": "haste build"
  }
}
```

That's it, you can start working on your app by running one of the supported commands: `start`, `test` or `build`.

## `npm start` or `yarn start`

Runs the app in dev mode, watching for file changes and updating the app in response.

## `npm test` or `yarn test`

Runs all of your app's tests with Jest. Supports a `--watch` flag to watch for file changes and run again.

## `npm build` or `yarn build`

Builds your app for production. It bundles your client side code, minifies it and optimizes the build for the best performance.

## Configuration

You can provide custom configuration for the preset adding a `haste` field in your `package.json` or by creating a `.hasterc` file.
