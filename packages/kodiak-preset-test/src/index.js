module.exports = ({ files }) => {
  const test = [
    [
      { task: 'kodiak-task-mocha', args: { files } }
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
