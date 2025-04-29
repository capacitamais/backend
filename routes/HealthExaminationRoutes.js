const router = require('express').Router()
const HealthExaminationController = require('../controllers/HealthExaminationController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), HealthExaminationController.create)
router.get('/', HealthExaminationController.getAll)
router.get('/:id', HealthExaminationController.getById)
router.put('/:id', checkAuth, checkRole('analyst'), HealthExaminationController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), HealthExaminationController.delete)

module.exports = router
