const router = require("express").Router();
const EmployeeHealthExaminationController = require("../controllers/EmployeeHealthExaminationController");

//middlewres
const checkAuth = require("../helpers/check-auth");
const checkRole = require("../helpers/check-role");

router.post(
  "/",
  checkAuth,
  checkRole("analyst"),
  EmployeeHealthExaminationController.register
);

router.get(
  "/employee/:id",
  checkAuth,
  checkRole("analyst"),
  EmployeeHealthExaminationController.getAllByEmployeeId
);

router.patch(
  "/deactivate/:examinationId",
  checkAuth,
  checkRole("analyst"),
  EmployeeHealthExaminationController.deactivate
);

router.delete(
  "/:id",
  checkAuth,
  checkRole("analyst"),
  EmployeeHealthExaminationController.delete
);

module.exports = router;
