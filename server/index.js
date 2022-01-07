const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');
const port = 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on port: ${port}`));
}

module.exports = app;

