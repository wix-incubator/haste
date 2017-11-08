# haste-task-read
Haste task for reading files from the file system.

The task returns a promise with an array of virtual files:

* a virtaul file consist of two things:
  1. filename `<string>` - an absolute path to the file.
  2. content `<string>` - the content of the file encoded to `utf-8`.
```js
read({ pattern: '**.*'})
  .then(virtualFiles => console.log(virtualFiles))

// [{ filename: "/path/to/file.js", content: "file content"}]

```
## options

#### pattern

Type: `string`

A glob pattern, uses [globby](https://github.com/sindresorhus/globby) under the hood.

#### filter

Type: `function`

A filter function that gets the identified filenames from the glob pattern and can filter them through a custom rule.

```js

// take only file without underscore prefix

read({
  pattern: '**.*',
  filter: (filename) => noUnderscorePrefix(filename)
})
```
