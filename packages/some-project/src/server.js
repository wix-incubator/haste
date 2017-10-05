const express = require('express');

const app = express();

app.use((req, res) => {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
