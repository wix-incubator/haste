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
```

We're using [lerna](https://github.com/lerna/lerna) for managing kodiak repo.

## Licensing
The MIT License