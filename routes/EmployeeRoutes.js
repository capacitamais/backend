const router = require('express').Router()
const EmployeeController = require('../controllers/EmployeeController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), EmployeeController.create)
router.get('/:id', checkAuth, checkRole('analyst'), EmployeeController.getById)
router.get('/', checkAuth, checkRole('analyst'), EmployeeController.getAll)
router.get('/registration/:registrationOrName', checkAuth, checkRole('analyst'), EmployeeController.getEmployeeByRegistrationOrName)
router.get('/training/:employeeId', checkAuth, checkRole('analyst'), EmployeeController.listTrainingReceivedByEmployee)
router.put('/:id', checkAuth, checkRole('analyst'), EmployeeController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), EmployeeController.delete)

module.exports = router
