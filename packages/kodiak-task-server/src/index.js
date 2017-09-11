const express = require('express');

module.exports = () => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  return new Promise((resolve) => {
    app.listen(3000, () => {
      resolve({ idle: true });
      console.log('app listening on port 3000!');
    });
  });
};
