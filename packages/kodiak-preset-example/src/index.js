const KodiakPluginLogger = require('kodiak-plugin-logger');

module.exports = ({ files, watch }) => {
  const commands = {
    test: [
      [
        { task: 'kodiak-task-mocha', options: { files, watch } },
        { task: 'kodiak-task-webpack', options: { plugins: [require.resolve('kodiak-webpack-plugin-example')] } },
      ]
    ]
  };

  const plugins = [
    new KodiakPluginLogger()
  ];

  return {
    commands,
    plugins
  };
};
