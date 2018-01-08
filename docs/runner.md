---
id: runner
title: Runner
---

An object that enables you to define commands.

## Runner methods

### command(action, options)

#### Arguments
1. action (async function)
2. options ({ persistent })
  * persistent (boolean) - whether the runner should quit execution when all tasks are done (false) or keep watching (true).

#### Returns
[Command](/haste/docs/command.html) - (async function)

<!-- #### watch -->
