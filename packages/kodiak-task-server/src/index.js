const express = require('express');

module.exports = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  const promise = new Promise((resolve) => {
    app.listen(3000, resolve);
  });

  return promise
    .then(() => console.log('app listening on port 3000!'));
};
