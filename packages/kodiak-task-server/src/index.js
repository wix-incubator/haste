const express = require('express');

module.exports = () => {
  return new Promise(() => {
    const app = express();

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(3000, () => {
      console.log('app listening on port 3000!');
    });
  });
};
