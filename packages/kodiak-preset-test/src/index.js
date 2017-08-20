module.exports = ({ files, watch }, { fast }) => {
  const test = [
    [
      { task: 'kodiak-task-mocha', args: { files, watch } },
      { task: 'kodiak-task-webpack', args: { plugins: ['kodiak-webpack-plugin'] } },
    ],
    [
      ...fast ? [] : [
        { task: 'kodiak-task-some' },
        { task: 'kodiak-task-other' }
      ]
    ]
  ];

  return {
    test
  };
};
