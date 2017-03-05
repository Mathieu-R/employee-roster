const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// DB Schema
const employeeSchema = new Schema({
  number: {
    type: Number,
    unique: [true, 'Employee must have a unique number.'],
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: String,
  age: {
    type: Number,
    required: true
  },
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
  salary: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define model
const employee = mongoose.model('Employee', employeeSchema);

module.exports = employee;
