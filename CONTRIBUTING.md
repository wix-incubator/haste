# Contributing to Haste

Hey! Thanks for your interest in improving Haste! There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Submitting an Issue
Please provide us with an issue in case you've found a bug, want a new feature, have an awesome idea, or there is something you want to discuss.

## Submitting a Pull Request
Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for Haste. Generally always have a related issue with discussions for whatever you are including.

## Folder Structure
Haste is a monorepo, meaning it is divided into independent sub-packages.
These packages can be found in the [`packages/`](https://github.com/wix/haste/tree/master/packages) directory. We're using [Lerna](https://github.com/lerna/lerna) for the repo management.

```bash
└── packages
  ├── haste-cli
  ├── haste-core
  ├── haste-test-utils
  ├── haste-preset-**
  ├── haste-plugin-**
  └── haste-task-**
```

### Package Descriptions
#### [haste-cli](https://github.com/wix/haste/tree/master/packages/haste-cli)
A package that manages all the CLI features.
#### [haste-core](https://github.com/wix/haste/tree/master/packages/haste-core)
The main package that does all the heavy lifting.
#### [haste-test-utils](https://github.com/wix/haste/tree/master/packages/haste-test-utils)
A package that helps with testing of tasks and plugins.
#### haste-preset-**
Prefix for every haste preset.
#### haste-plugin-**
Prefix for every haste plugin.
#### haste-task-**
Prefix for every haste task.

## Local Setup
1. Clone the repo `git clone git@github.com:wix/haste.git`.
2. Run `npm install && npm run bootstrap` in the root haste directory.

That's it, you're good to go.

* `npm test` - Run tests of all packages in parallel using [jest](https://facebook.github.io/jest/).
* `npm run lint` - Run [eslint](https://eslint.org/) on all packages with the following [rules](https://github.com/wix/haste/blob/master/.eslintrc).
* `npm run test:watch` Run the tests using interactive watch mode.

## The website
Improving the documentation is an easy way to start contributing. The `docs` directory contains the documentation itself as markdown files, while the website itself is in the `website` directory.

> We are using [docusaurus](http://docusaurus.io) for the website generation.

```bash
├── website
└── docs

```

* `npm run website:install` - Install the website's dependencies.
* `npm run website:start` - Run a development server with the local version of the site.
* `GIT_USER=<GIT_USER> npm run website:publish` - Build and publish your current version to gh-pages.

------------

*Thanks to [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/CONTRIBUTING.md) for the inspiration with this contributing guide*
