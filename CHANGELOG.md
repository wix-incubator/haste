# Changelog

## 0.1.20 (November 19, 2017)

#### :bug: Bug Fix
* `haste-task-copy`
  * [#147](https://github.com/wix/haste/pull/147) use cwd of a file from the read task instead of it's own cwd option

## 0.1.19 (November 16, 2017)

#### :nail_care: Enhancement
* `haste-task-copy`
  * [#146](https://github.com/wix/haste/pull/146) Has been created and can be used
* `haste-task-webpack`
  * [#145](https://github.com/wix/haste/pull/145) Support a watch option that runs the compiler in watch mode
* `haste-task-karma`
  * [#144](https://github.com/wix/haste/pull/144) Support a watch option that runs karma in watch mode and resolves after the first run
* `haste-task-protractor`
  * [#143](https://github.com/wix/haste/pull/143) Accept `webdriverManagerOptions` as an object instead of an array

#### :bug: Bug Fix
* `haste-task-protractor`
  * [#143](https://github.com/wix/haste/pull/143) Merge passed `webdriverManagerOptions` with default options correctly

## 0.1.18 (November 14, 2017)

#### :nail_care: Enhancement
* `haste-task-webpack`
  * [#142](https://github.com/wix/haste/pull/142) Move webpack to be a peerDependency

## 0.1.17 (November 12, 2017)

#### :bug: Bug Fix
* `haste-task-jasmine`
  * [#140](https://github.com/wix/haste/pull/140) Clean `require.cache` after a failing run

## 0.1.16 (November 12, 2017)

#### :nail_care: Enhancement
* `haste-task-jasmine`
  * [#138](https://github.com/wix/haste/pull/138) Check if a spec filename is not absolute and use file.cwd and construct an absolute filename
  * [#138](https://github.com/wix/haste/pull/138) Don't remove modules within 'node_modules' folder from require cache between runs

## 0.1.15 (November 10, 2017)

#### :bug: Bug Fix
* `haste-cli`
  * [#135](https://github.com/wix/haste/pull/135) Don't normalize absolute preset names

## 0.1.14 (November 10, 2017)

#### :nail_care: Enhancement
* `haste-task-read`
  * [#132](https://github.com/wix/haste/pull/132) Support passing an `options` option to be used by [globby](https://github.com/sindresorhus/globby)
  * [#132](https://github.com/wix/haste/pull/132) Virtual filesystem now supports a cwd property, can be used by tasks to resolve the absolute file path

## 0.1.13 (November 9, 2017)

#### :nail_care: Enhancement
* `haste-cli`
  * [#129](https://github.com/wix/haste/pull/129) Standardize preset prefix name: a preset can be referenced without the `haste-preset-*` prefix

* `haste-test-utils`
  * [#133](https://github.com/wix/haste/pull/133) Enable worker options and a setup function that creates files for the test

* `haste-task-eslint`
  * [#133](https://github.com/wix/haste/pull/133) Enable passing fix option that automatically fixes problems

## 0.1.12 (November 8, 2017)

#### :nail_care: Enhancement
* `haste-task-webpack`
  * [#127](https://github.com/wix/haste/pull/127) Support configPath resolving into a function

## 0.1.11 (November 7, 2017)

#### :nail_care: Enhancement
* `haste-task-typescript`
  * [#121](https://github.com/wix/haste/pull/121) Basic integration with Typescript

## 0.1.10 (November 5, 2017)

#### :bug: Bug Fix
* `haste-test-utils`
  * [#116](https://github.com/wix/haste/pull/116) Log an error if a worker fails
* `haste-task-protractor`
  * [#120](https://github.com/wix/haste/pull/120) Increase test timeout to 30s to prevent flakyness

#### :nail_care: Enhancement
* `haste-test-utils`
  * [#117](https://github.com/wix/haste/pull/117) Support checking for stderr of a process
* `haste-task-jest`
  * [#117](https://github.com/wix/haste/pull/117) Basic integration with Jest
* `haste-task-tslint`
  * [#117](https://github.com/wix/haste/pull/117) Basic integration with TSLint

#### :house: Internal
* `haste`
  * [#117](https://github.com/wix/haste/pull/117) Add 'fixtures' to Jest's `testIgnorePatterns`
  * [#118](https://github.com/wix/haste/pull/118) Remove redundant spaces from changelog

## 0.1.9 (November 2, 2017)

#### :bug: Bug Fix
* `haste-test-utils`
  * [#115](https://github.com/wix/haste/pull/115) Support running a task multiple times
* `haste-task-mocha`
  * [#115](https://github.com/wix/haste/pull/115) Do not remove require cache of node_module between runs

#### :house: Internal
* `haste`
  * [#115](https://github.com/wix/haste/pull/115) Add coverage folder to `.eslintignore`

## 0.1.8 (November 1, 2017)

#### :bug: Bug Fix
* `haste-task-mocha`
  * [#109](https://github.com/wix/haste/pull/109) Clear require cache after every mocha run
* `haste-task-webpack`
  * [#110](https://github.com/wix/haste/pull/110) Reject if webpack fails with compilation errors

#### :nail_care: Enhancement
* `haste-task-jasmine`
  * [#111](https://github.com/wix/haste/pull/111) Has been created and can be used
* `haste-task-karma`
  * [#112](https://github.com/wix/haste/pull/112) Has been created and can be used

## 0.1.7 (October 30, 2017)

#### :nail_care: Enhancement
* `haste-task-express`
  * [#108](https://github.com/wix/haste/pull/108) Has been created and can be used
* `haste-cli`
  * [#107](https://github.com/wix/haste/pull/107) Add an option to supply preset through cli option --preset/-p
* `haste-plugin-logger`
  * [#106](https://github.com/wix/haste/pull/106) Max listeners on stdout and stderr is set to 100 for cases with more than 10 workers
* `haste-task-server`
  * [#105](https://github.com/wix/haste/pull/105) Has been renamed to `haste-task-spawn`

## 0.1.6 (October 29, 2017)

#### :nail_care: Enhancement
* `haste-task-eslint`
  * [#103](https://github.com/wix/haste/pull/103) Move eslint to be a peer dependency

## 0.1.5 (October 26, 2017)

#### :bug: Bug Fix
* `haste-core`
  * [#99](https://github.com/wix/haste/pull/99) Run tasks with an empty options object by default
* `haste-task-read`
  * [#98](https://github.com/wix/haste/pull/98) Read only files and not directories

#### :nail_care: Enhancement
* `haste-task-webpack-dev-server`
  * [#100](https://github.com/wix/haste/pull/100) Support passing a callback that accepts the webpack compiler

## 0.1.4 (October 25, 2017)

#### :bug: Bug Fix
* `haste-core`
  * [#88](https://github.com/wix/haste/pull/88) Do not exit on run failure when persistent flag is configured
  * Handle a case where a task is rejected with undefined

#### :nail_care: Enhancement
* `haste-task-webpack-dev-server`
  * [#96](https://github.com/wix/haste/pull/96) Support passing decorator that accepts express instance
* `haste-task-webpack`
  * [#93](https://github.com/wix/haste/pull/93) Support passing callback that accepts webpack err and stats
* `haste-task-write`
  * [#92](https://github.com/wix/haste/pull/92) Write source maps for javascript files
* `haste-core`
  * [#89](https://github.com/wix/haste/pull/89) Runner has an 'idle' state when configured to be persistent and finished the initial run

## 0.1.3 (October 23, 2017)

#### :bug: Bug Fix
* `haste-task-babel`, `haste-task-sass`, `haste-task-less`
  * Remove specific changes logging in babel, sass and less tasks
* `haste-test-utils`
  * [#83](https://github.com/wix/haste/pull/83) Pass a default options object in haste-test-utils
* `haste-core`
  * [#84](https://github.com/wix/haste/pull/84) Function notation doesn't transform file system pathes
* `haste-cli`
  * [#87](https://github.com/wix/haste/pull/87) Log only non worker errors

#### :nail_care: Enhancement
* `haste-task-mocha`
  * [#83](https://github.com/wix/haste/pull/83) `requireFiles` option for haste-task-mocha
* `haste-task-write`
  * [#85](https://github.com/wix/haste/pull/85) `base` option for haste-task-write
* `haste-core`
  * [#84](https://github.com/wix/haste/pull/84) Metadata object for plugins usage
* `haste-plugin-logger`
  * [#86](https://github.com/wix/haste/pull/86) Log start and finish on runs instead of tasks

#### :house: Internal
* `haste-core`
  * [#84](https://github.com/wix/haste/pull/84) Refactor stdout handling on tests

## 0.1.2 (October 18, 2017)

#### :bug: Bug Fix
* `haste-core`
  * [994913](https://github.com/wix/haste/commit/99491386b503cf2a64ed0904e889c81dcba0698f) Pass the runner's process.env to it's child processes

#### :nail_care: Enhancement
* `haste-core`
  * [#76](https://github.com/wix/haste/pull/76) `runner.close()` function to close down the runner and all it's processes
* `haste-task-stylelint`
  * [#72](https://github.com/wix/haste/pull/72) Has been created and can be used
* `haste-task-less`
  * [#71](https://github.com/wix/haste/pull/71) Has been created and can be used
* `haste-task-protractor`
  * [#77](https://github.com/wix/haste/pull/77) Has been created and can be used

#### :house: Internal
* `haste`
  * [#75](https://github.com/wix/haste/pull/75) Code coverage integration with [codecov](https://codecov.io/)
  * Travis CI configuration

## 0.1.1 (October 12, 2017)

#### :bug: Bug Fix
* `haste`
  * Correct file path to haste bin from `package.json`

## 0.1.0 (October 12, 2017)
  * Initial public release (see commit history for changes in previous versions of haste)
