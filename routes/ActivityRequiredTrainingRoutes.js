const router = require('express').Router()
const ActivityRequiredTrainingController = require('../controllers/ActivityRequiredTrainingController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.post('/', checkAuth, checkRole('analyst'), ActivityRequiredTrainingController.register)

module.exports = router
