# haste-task-read
Haste task for reading files from the file system.

The task returns a promise with an array of virtual files:

* A virtual file consists of two things:
  1. filename `<string>` - the file path relative to `process.cwd()`.
  2. content `<string>` - the content of the file encoded to `utf-8`.
  3. cwd `<string>` - the current working directory of the file.

```js
run(read({ pattern: '**.*'}))
  .then(virtualFiles => console.log(virtualFiles))

// [{ filename: "./realtive/path/to/file.js", content: "file content"}]
```

## options

#### pattern

Type: `String|Array<String>`

A glob pattern to be matched against.

#### options

Type: `Object`

Customisation object for glob mathing.

**Note:** This task uses [globby](https://github.com/sindresorhus/globby) under the hood. Please see it's documentation to see the available patterns and options.
