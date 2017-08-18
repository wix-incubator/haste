process.on('message', async (data) => {
  const task = require(data.task);
  try {
    await task();
    process.send({
      success: true
    });
  } catch (error) {
    process.send({
      success: false,
      error
    });
  }
});
