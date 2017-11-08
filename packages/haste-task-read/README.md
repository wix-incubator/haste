# haste-task-read
Haste task for reading files from the file system.

The task returns a promise with an array of virtual files:

* A virtual file consists of two things:
  1. filename `<string>` - an absolute path to the file.
  2. content `<string>` - the content of the file encoded to `utf-8`.
```js
run(read({ pattern: '**.*'}))
  .then(virtualFiles => console.log(virtualFiles))

// [{ filename: "/path/to/file.js", content: "file content"}]

```
## options

#### pattern

Type: `string`

A glob pattern, uses [globby](https://github.com/sindresorhus/globby) under the hood.
