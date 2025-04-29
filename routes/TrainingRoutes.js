const router = require('express').Router()
const TrainingController = require('../controllers/TrainingController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), TrainingController.create)
router.get('/', TrainingController.getAll)
router.get('/:id', TrainingController.getById)
router.put('/:id', checkAuth, checkRole('analyst'), TrainingController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), TrainingController.remove)

module.exports = router
