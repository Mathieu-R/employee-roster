const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB Schema
const employeeSchema = new Schema({
  number: {
    type: Number,
    unique: [true, 'Employee must have a unique number.']
  },
  firstName: String,
  lastName: String,
  middleName: String,
  age: Number,
  designation: {
    type: String,
    enum: [
      'Consultant',
      'Senior Consultant',
      'Lead',
      'Assistant Manager',
      'Manager',
      'Senior Manager'
    ]
  },
  salary: Number
});

// Define model
const employee = mongoose.model('Employee', employeeSchema);

module.exports = employee;
