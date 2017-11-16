# haste-task-copy
Haste task for copying files.

```js
await run(
  read({ pattern: '**.*' })
  copy({ target: 'static' })
)

```

## options

#### target

Type: `String`

A relative/absolute path which the files will be copied relatively to.

#### cwd

Type: `String`

An absolute path which the target will be relative to, defaults to `process.cwd()`.
