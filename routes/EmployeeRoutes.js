const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), EmployeeController.create)
router.get('/', EmployeeController.getAll)
router.get('/:id', EmployeeController.getById)
router.get('/registration/:registrationOrName', EmployeeController.getEmployeeByRegistrationOrName)
router.get('/training/:employeeId', EmployeeController.listTrainingReceivedByEmployee)
router.put('/:id', checkAuth, checkRole('analyst'), EmployeeController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), EmployeeController.remove)

module.exports = router
