module.exports = ({ files, watch }) => {
  const test = [
    [
      { task: 'kodiak-task-mocha', args: { files, watch } },
      { task: 'kodiak-task-webpack' },
    ],
    [
      { task: 'kodiak-task-some' },
      { task: 'kodiak-task-other' }
    ]
  ];

  return {
    test
  };
};
