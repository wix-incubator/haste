process.on('message', ({ module, options }) => {
  require(module)(options)
    .then(() => process.send({ success: true }))
    .catch(() => process.send({ success: false }));
});
