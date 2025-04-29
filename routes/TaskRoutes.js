const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), TaskController.create)
router.get('/', TaskController.getAll)
router.get('/:id', TaskController.getById)
router.get('/technician/:technicianId', TaskController.getByTechnician)
router.put('/:id', checkAuth, checkRole('analyst'), TaskController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), TaskController.delete)

module.exports = router