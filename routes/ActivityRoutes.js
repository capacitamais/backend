const router = require('express').Router()
const ActivityController = require('../controllers/ActivityController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), ActivityController.create)
router.get('/:id', checkAuth, checkRole('analyst'), ActivityController.getById)
router.get('/', checkAuth, checkRole('analyst'), ActivityController.getAll)
router.get('/name/:name', checkAuth, checkRole('analyst'), ActivityController.getByName)
router.get('/required-training/:activityId', ActivityController.listRequiredTrainingByActivity)
router.patch('/:id', checkAuth, checkRole('analyst'), ActivityController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), ActivityController.delete)

module.exports = router
