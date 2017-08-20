module.exports = ({ files, watch }, { fast }) => {
  const test = [
    [
      { task: 'kodiak-task-mocha', args: { files, watch } },
      { task: 'kodiak-task-webpack' },
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
