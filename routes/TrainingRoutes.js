const router = require('express').Router();
const TrainingController = require('../controllers/TrainingController');

// middlewares
const checkAuth = require('../helpers/check-auth');
const checkRole = require('../helpers/check-role');
const upload = require('../helpers/upload');
router.post('/', checkAuth, checkRole('analyst'), TrainingController.create);
router.get('/:id', checkAuth, checkRole('analyst'), TrainingController.getById);
router.get('/', checkAuth, checkRole('analyst'), TrainingController.getAll);
router.patch('/:id', checkAuth, checkRole('analyst'), TrainingController.update);
router.patch('/deactivate/:id', checkAuth, checkRole('analyst'), TrainingController.deactivate);
router.post('/import', checkAuth, checkRole('analyst'), upload.single('file'), TrainingController.importFromCSV);
router.get(
  '/report',
  checkAuth,
  checkRole('technician'),
  TrainingController.report
);
module.exports = router;
