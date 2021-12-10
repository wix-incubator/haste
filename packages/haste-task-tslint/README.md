# haste-task-tslint
Haste task for running tslint.

```js
await tslint({
  tsconfigFilePath: path.resolve('tsconfig.json')
});
```

## options

#### tsconfigFilePath

Type: `String`

An absolute path of the `tsconfig.json` file.

#### tslintFilePath

Type: `String`

An absolute path of the `tslint.json` file.

#### options

Type: `Object`

Options object to pass for the linter. For example:

```js
const options = {
  fix: false,
  formatter: "json",
  rulesDirectory: "customRules/",
  formattersDirectory: "customFormatters/"
};
```

#### pattern

Type: `Array`

Regex that specifies the files to run the linter on. For example:

```js
await tslint({
  pattern: [`<rootDir>/**/*.ts{,x}`]
});
```

Note that the task must receive at least one of `tsconfigFilePath` or `pattern` in order to know which files to run the linter on. in case both `tsconfigFilePath` and `pattern` are provided, the linter will ignore the `pattern` parameter.
