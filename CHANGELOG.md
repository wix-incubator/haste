# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
