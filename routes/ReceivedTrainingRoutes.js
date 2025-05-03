const router = require('express').Router()
const TrainingReceivedController = require('../controllers/TrainingReceivedController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), TrainingReceivedController.register)

module.exports = router
