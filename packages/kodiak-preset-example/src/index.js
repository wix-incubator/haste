// const KodiakPluginLogger = require('kodiak-plugin-logger');
const KodiakPluginDashboard = require('kodiak-plugin-dashboard');

module.exports = ({ files, watch }) => {
  const commands = {
    test: [
      [
        { task: require.resolve('kodiak-task-mocha'), options: { files, watch } },
        { task: require.resolve('kodiak-task-webpack'), options: { plugins: [require.resolve('kodiak-webpack-plugin-example')] } },
      ],
      [
        { task: require.resolve('kodiak-task-server') }
      ]
    ]
  };

  const plugins = [
    // new KodiakPluginLogger(),
    new KodiakPluginDashboard()
  ];

  return {
    commands,
    plugins
  };
};
