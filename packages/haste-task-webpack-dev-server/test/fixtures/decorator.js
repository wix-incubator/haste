module.exports = (app) => {
  app.get('/foo', (req, res) => res.send('bar'));
};
