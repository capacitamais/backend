const router = require("express").Router();
const TrainingReceivedController = require("../controllers/TrainingReceivedController");

//middlewres
const checkAuth = require("../helpers/check-auth");
const checkRole = require("../helpers/check-role");

router.post(
  "/",
  checkAuth,
  checkRole("analyst"),
  TrainingReceivedController.register
);

router.get(
  "/employee/:id",
  checkAuth,
  checkRole("analyst"),
  TrainingReceivedController.getAllByEmployeeId
);

router.patch(
  "/deactivate/:trainingId",
  checkAuth,
  checkRole("analyst"),
  TrainingReceivedController.deactivate
);

module.exports = router;
