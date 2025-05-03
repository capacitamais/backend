const EmployeeHealthExamination = require("../models/EmployeeHealthExamination");

module.exports = class EmployeeHealthExaminationController {
  static async register(req, res) {
    try {
      const { employeeId, healthExaminationId, date, dueDate } = req.body;

      const record = await EmployeeHealthExamination.create({
        employee: employeeId,
        healthExamination: healthExaminationId,
        date,
        dueDate,
      });

      res.status(201).json(record);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao vincular exame ao colaborador.", details: err.message });
    }
  }
};
