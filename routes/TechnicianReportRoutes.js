const router = require("express").Router();
const TechnicianReportController = require("../controllers/TechnicianReportController");

//middlewres
const checkAuth = require("../helpers/check-auth");
const checkRole = require("../helpers/check-role");

router.get(
  "/",
  checkAuth,
  checkRole("technician"),
  TechnicianReportController.getByTechnician
);

module.exports = router;
