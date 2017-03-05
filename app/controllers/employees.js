const Employees = require('../models/employees');

const employeesCtrl = {
  getAll(req, res) {
    Employees.find()
      .then((emoloyees) => {
        res.send(emoloyees);
      })
      .catch((err) => {
        res.status(500).send({ error: err.message });
      });
  },

  create(req, res) {
    Employees.create(req.body)
      .then((employee) => {
        res.send(employee);
      })
      .catch((err) => {
        res.status(400).send({ error: err.message });
      })
  },

  getOne(req, res) {
    res.send('getOne: employees');
  },

  update(req, res) {
    res.send('update: employees');
  },

  delete(req, res) {
    res.send('delete: employees');
  }
};

module.exports = employeesCtrl;