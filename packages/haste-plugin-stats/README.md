# Haste-plugin-stats
Saves statistics of your build history


## why ?
Other plugins can later use this file to create various awesome features.

1. Time estimation based on last builds.
2. Build monitoring.
3. Investigate why your build time drastically changed.
4. Find frequent errors.

and more...

## usage
Just add the plugin in your configure function

```js
const StatsPlugin = require('haste-plugin-stats');

const { run, tasks } = configure({
    plugins: [
      new StatsPlugin()
    ],
  });
```

__important!__ The stats file should stay out of your version control, put it on `.gitignore`.

## options
* **base `<string>` :** the root directory which the file is saved in (defaults to process.cwd())
* **directory `<string>` :** the directory to put the stats files (defaults to 'build-stats')
* **filename `<string>` :** the filename to save the stats, due to multiple actions/commands you can also write a pattern with a name variable which will be the action name (defaults to 'haste-stats-[name]')

## The problems
If we want this plugin to have a significant effect, other plugins should rely on its existence.

If we'll let users change its location via options, other plugins wouldn't know.
One solution is to configure it statically via package.json for example.
Another solution is not to configure it at all.
