const router = require('express').Router();
const TrainingController = require('../controllers/TrainingController');

// middlewares
const checkAuth = require('../helpers/check-auth');
const checkRole = require('../helpers/check-role');

router.post('/', checkAuth, checkRole('analyst'), TrainingController.create);
router.get('/:id', checkAuth, checkRole('analyst'), TrainingController.getById);
router.get('/', checkAuth, checkRole('analyst'), TrainingController.getAll);
router.put('/:id', checkAuth, checkRole('analyst'), TrainingController.update);
router.put('/deactivate/:id', checkAuth, checkRole('analyst'), TrainingController.deactivate);

module.exports = router;
