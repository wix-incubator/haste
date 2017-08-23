# kodiak
Next generation extendable task runner
## Basic types

* task :: (...options) => Promise (undefined)
* command :: [ [ tasknames ] ]
* preset :: { string: command }

## Development

```
git clone git@github.com:ronami/kodiak.git
cd kodiak
npm install
npm run bootstrap
npm run build
```

Install flow support to your IDE, if you're using vscode, [use this one](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode)
## Tooling

* [lerna](https://github.com/lerna/lerna) - managing kodiak monorepo.
* [flow](https://flow.org/) - type checking.
* [eslint](https://eslint.org/) - linting.
* [babel](https://babeljs.io/) - transpiling.

## Lint
```
npm run lint
```

## Build
```
npm run build
```

## Publish
```
lerna publish
```
## Licensing
The MIT License
