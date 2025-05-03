const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), TaskController.create)
router.get('/:id', checkAuth, checkRole('analyst'), TaskController.getById)
router.get('/', checkAuth, checkRole('analyst'), TaskController.getAll)
router.get('/technician/:technicianId', TaskController.getByTechnician)
router.patch('/:id', checkAuth, checkRole('analyst'), TaskController.update)
router.patch('/deactivate/:id',checkAuth, checkRole('analyst'), TaskController.deactivate)
router.delete('/:id', checkAuth, checkRole('analyst'), TaskController.delete)

module.exports = router