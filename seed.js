require('dotenv').config({ silent: true });

const mongoose = require('mongoose');
const Employee = require('./app/models/employees');
const data = require('./data.json');

const dbURI = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

Employee.insertMany(data)
  .then(() => {
    process.stderr.write('Employees created...\n');
    process.exit(0);
  })
  .catch(() => {
    process.stderr.write('Failed to create employees...\n');
    process.exit(0);
  });

// Employee.remove({})
//   .then(() => {
//     console.log("Done");
//     process.exit(0);
//   })