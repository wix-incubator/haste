// const KodiakPluginLogger = require('kodiak-plugin-logger');
const KodiakPluginDashboard = require('kodiak-plugin-dashboard');

module.exports = ({ files, watch }) => {
  const commands = {
    test: [
      [
        { module: require.resolve('kodiak-task-mocha'), options: { files, watch } },
        { module: require.resolve('kodiak-task-webpack'), options: { plugins: [require.resolve('kodiak-webpack-plugin-example')] } },
      ],
      [
        { module: require.resolve('kodiak-task-server') }
      ]
    ]
  };

  const mapping = async ([[mocha, webpack], [server]]) => {
    // webpack.stream.subscribe(({ message }) => server.send(message.hello));
  };

  const plugins = [
    // new KodiakPluginLogger(),
    new KodiakPluginDashboard()
  ];

  return {
    commands,
    plugins,
    mapping,
  };
};
