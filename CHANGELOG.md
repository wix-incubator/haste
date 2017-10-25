# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 0.1.4 - 2017-10-25

### Bug Fixes
 - handle a case where a task is rejected with undefined
 - do not exit on run failure when persistent flag is configured

### Added
 - **haste-task-webpack-dev-server:** support passing decorator that accepts express instance
 - **haste-task-webpack:** support passing callback that accepts webpack err and stats
 - **haste-task-write:** write source maps for javascript files
 - runner has an 'idle' state when configured to be persistent and finished the initial run

## 0.1.3 - 2017-10-23

### Added
 - 'requireFiles' option for haste-task-mocha
 - 'base' option for haste-task-write
 - metadata object for plugins usage
 - haste-plugin-logger now logs start and finish on runs instead of tasks

### Bug Fixes
 - remove specific changes logging in babel, sass and less tasks
 - pass a default options object in task haste utils
 - function notation now doesn't transform file system pathes
 - haste-cli now log only non worker errors

### Refactor
 - stdout handling on tests

## 0.1.2 - 2017-10-18

### Added
 - haste-task-stylelint
 - haste-task-less
 - travis ci
 - code coverage
 - runner.close() function
 - haste-task-protractor

### Bug Fixes
 - pass process.env to child processes

## 0.1.1 - 2017-10-12

### Bug Fixes
 - correct file path to haste bin

## 0.1.0 - 2017-10-12
 - initial release (see commit history for changes in previous versions of haste)
