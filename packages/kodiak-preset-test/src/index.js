const KodiakPluginLogger = require('kodiak-plugin-logger');

module.exports = ({ files, watch }, { fast }) => {
  const commands = {
    test: [
      [
        { task: 'kodiak-task-mocha', options: { files, watch } },
        { task: 'kodiak-task-webpack', options: { plugins: ['kodiak-webpack-plugin'] } },
      ],
      [
        ...fast ? [] : [
          { task: 'kodiak-task-some' },
          { task: 'kodiak-task-other' }
        ]
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
