const express = require('express');

module.exports = ({ idle }, params, { listen }) => {
  const app = express();

  let text = 'Hello World!';

  listen(newText => text = newText);

  app.get('/', (req, res) => {
    res.send(text);
  });

  app.listen(3000, () => {
    console.log('app listening on port 3000!');
    idle();
  });
};
