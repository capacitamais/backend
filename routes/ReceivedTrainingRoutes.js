const router = require("express").Router();
const upload = require("../helpers/upload");
const ReceivedTrainingController = require("../controllers/ReceivedTrainingController");

//middlewres
const checkAuth = require("../helpers/check-auth");
const checkRole = require("../helpers/check-role");

router.post(
  "/",
  checkAuth,
  checkRole("analyst"),
  ReceivedTrainingController.register
);

router.get(
  "/employee/:id",
  checkAuth,
  checkRole("analyst"),
  ReceivedTrainingController.getAllByEmployeeId
);

router.patch(
  "/deactivate/:trainingId",
  checkAuth,
  checkRole("analyst"),
  ReceivedTrainingController.deactivate
);

router.delete(
  "/:id",
  checkAuth,
  checkRole("analyst"),
  ReceivedTrainingController.delete
);

router.post(
  "/import",
  checkAuth,
  checkRole("analyst"),
  upload.single("file"),
  ReceivedTrainingController.import
);

module.exports = router;
