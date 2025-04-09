const router = require('express').Router()
const EmployeeHealthExaminationController = require('../controllers/EmployeeHealthExaminationController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), EmployeeHealthExaminationController.register)

module.exports = router
