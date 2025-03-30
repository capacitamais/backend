const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middlewres
const checkAuth = require('../helpers/check-auth')
const checkRole = require('../helpers/check-role')

router.get('/', UserController.getAllUsers)
router.get('/:id', UserController.getById)
router.get('/check-user', UserController.checkUser)
router.post('/register', checkAuth, checkRole('analyst'), UserController.register)
router.post('/login', UserController.login)
router.patch('/edit/:id', checkAuth, checkRole('analyst'), UserController.editUser)

module.exports = router
