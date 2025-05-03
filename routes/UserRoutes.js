const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.get('/check-user', UserController.checkUser)
router.get('/:id', checkAuth, checkRole('analyst'), UserController.getById)
router.get('/', checkAuth, checkRole('analyst'), UserController.getAll)
router.post('/create', checkAuth, checkRole('analyst'), UserController.create)
router.post('/login', UserController.login)
router.patch('/update-password', checkAuth, UserController.updatePassword)
router.patch('/:id', checkAuth, checkRole('analyst'), UserController.update)
router.delete('/:id', checkAuth, checkRole('analyst'), UserController.delete)

module.exports = router
