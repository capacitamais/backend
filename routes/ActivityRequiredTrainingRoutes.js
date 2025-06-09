const router = require("express").Router();
const ActivityRequiredTrainingController = require("../controllers/ActivityRequiredTrainingController");

//middlewres
const checkAuth = require("../helpers/check-auth");
const checkRole = require("../helpers/check-role");

router.post(
  "/",
  checkAuth,
  checkRole("analyst"),
  ActivityRequiredTrainingController.register
);

router.get(
  "/activity/:id",
  checkAuth,
  checkRole("analyst"),
  ActivityRequiredTrainingController.getAllByActivityId
);

router.patch(
  "/deactivate/:trainingId",
  checkAuth,
  checkRole("analyst"),
  ActivityRequiredTrainingController.deactivate
);

router.delete(
  "/:id",
  checkAuth,
  checkRole("analyst"),
  ActivityRequiredTrainingController.delete
);

module.exports = router;
