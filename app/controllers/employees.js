const Employees = require('../models/employees');

const employeesCtrl = {
  getAll(req, res) {
    const page = req.query.page || 1;
    const skip = page == 1 ? 0 : (page - 1) * 10;

    Employees.count({})
      .then((count) => {
        Employees.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .skip(skip)
          .then((employees) => {
            res.send({ employees, count });
          })
          .catch((err) => {
            res.status(500).send({ message: err });
          })
      });
  },

  create(req, res) {
    Employees.create(req.body)
      .then((employee) => {
        res.send(employee);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  },

  getOne(req, res) {
    Employees.findOne({ number: req.params.id })
      .then((employee) => {
        if (employee) {
          return res.send(employee);
        }

        res.status(404).send({ message: 'Employee not found.' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  },

  update(req, res) {
    Employees.update({ number: req.params.id }, { $set: req.body })
      .then((result) => {
        if (result.n) {
          return res.send({ message: 'Employee updated' });
        }

        res.status(404).send({ message: 'Employee not found.' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  },

  delete(req, res) {
    Employees.remove({ number: req.params.id })
      .then((result) => {
        if (result.result.n) {
          return res.send({ message: 'Employee deleted' });
        }

        res.status(404).send({ message: 'Employee not found.' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }
};

module.exports = employeesCtrl;
