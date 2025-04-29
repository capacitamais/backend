const router = require('express').Router()
const ActivityController = require('../controllers/ActivityController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), ActivityController.create)
router.get('/', ActivityController.getAll)
router.get('/:id', ActivityController.getById)
router.put('/:id', checkAuth, checkRole('analyst'), ActivityController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), ActivityController.delete)
router.get('/name/:name', ActivityController.getActivityByName)
router.get('/required-trainings/:activityId', ActivityController.listRequiredTrainingsByActivity)

module.exports = router
