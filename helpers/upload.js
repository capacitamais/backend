const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;