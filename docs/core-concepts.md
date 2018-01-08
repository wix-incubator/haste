---
id: core-concepts
title: Core Concepts
---

Haste is a tool for creating build processes, you can use a predefined one, or create your own. The following are the entities in haste ecosystem:

**Preset** - The name of the whole build process. You can reuse it and spare the time of creating it for every project, you can also share it with the community and help others.

**Command** - Your preset is a group of commands, each of the commands triggers by a user action, e.g. `test`, `build`, `start` etc...

**Task** - A module that does side effect, like running `babel`, `typescript` or `mocha`.

**Plugin** - A way to interfere with the whole build process and the runner itself, when writing a plugin you'll get events for every task before it runs, you can cancel it, write data to the file system, monitor timings on the build and pretty much everything you can think of besides writing to the console, for that we have loggers.

**Logger** - A regular plugin, the difference is that you should use it to interact with the user using the console. You only want to have one plugin that handles writing information to the console, the logger is exactly that.

Every one of the above can be custom or a one created by someone else, you can create each of them as npm module and share it with the community.
