
const employeesCtrl = {
  getAll(req, res) {
    res.send('getAll: employees');
  },

  create(req, res) {
    res.send('create: employees');
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