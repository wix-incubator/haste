# Changelog

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
