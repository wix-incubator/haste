// const KodiakPluginLogger = require('kodiak-plugin-logger');
const KodiakPluginDashboard = require('kodiak-plugin-dashboard');
const KodiakPluginMapping = require('kodiak-plugin-mapping');

module.exports = ({ files, watch }) => {
  const commands = {
    test: [
      [
        { name: require.resolve('kodiak-task-mocha'), options: { files, watch } },
        { name: require.resolve('kodiak-task-webpack'), options: { plugins: [require.resolve('kodiak-webpack-plugin-example')] } },
      ],
      [
        { name: require.resolve('kodiak-task-server') }
      ]
    ]
  };

  const mapping = async ([[mocha, webpack], [server]]) => {
    // webpack.stream.subscribe(({ message }) => server.send(message.hello));
  };

  const plugins = [
    // new KodiakPluginLogger(),
    new KodiakPluginDashboard(),
    new KodiakPluginMapping({ mapping }),
  ];

  return {
    commands,
    plugins,
  };
};
