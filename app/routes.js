const router = require('express').Router();
const employeesCtrl = require('./controllers/employees');


router.route('/employees')
  .get(employeesCtrl.getAll)
  .post(employeesCtrl.create);

router.route('/employees/:id')
  .get(employeesCtrl.getOne)
  .put(employeesCtrl.update)
  .delete(employeesCtrl.delete);

router.get('*', (req, res) => {
  res.send({ message: 'Welcome to the Employees API.' });
})

module.exports = router;
