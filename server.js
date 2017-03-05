const express = require('express');
const parser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
// const routes = require('./app/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(logger('dev'));

// Mount routes
app.use('/', (req, res) => {
  res.send({ message: "Api Works"});
});

// Start server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
