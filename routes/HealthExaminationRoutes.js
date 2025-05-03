const router = require('express').Router()
const HealthExaminationController = require('../controllers/HealthExaminationController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), HealthExaminationController.create)
router.get('/:id', checkAuth, checkRole('analyst'), HealthExaminationController.getById)
router.get('/', checkAuth, checkRole('analyst'), HealthExaminationController.getAll)
router.patch('/:id', checkAuth, checkRole('analyst'), HealthExaminationController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), HealthExaminationController.delete)

module.exports = router
