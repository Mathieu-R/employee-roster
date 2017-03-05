require('dotenv').config({ silent: true });

const express = require('express');
const parser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const dbURI = process.env.DATABASE_URL
const routes = require('./app/routes');

const app = express();
mongoose.connect(dbURI);

app.use(cors());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(logger('dev'));

// Mount routes
app.use(routes);

// Start server
app.listen(port, () => {
  process.stdout.write(`Server running at port ${port} \n`);
});
