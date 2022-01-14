const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

console.log(result.parsed);

const express = require('express');
const app = express();
const cluster = require('cluster');
const os = require('os');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', router);

const numCpu = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server ${process.pid} @ http://localhost:${port}`));
  }
}

module.exports = app;

