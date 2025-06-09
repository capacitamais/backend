const EmployeeHealthExamination = require("../models/EmployeeHealthExamination");

module.exports = class EmployeeHealthExaminationController {
  static async register(req, res) {
    try {
      const { employeeId, healthExaminationId, date, dueDate } = req.body;

      const saved = await EmployeeHealthExamination.findOne({
        employee: employeeId,
        healthExamination: healthExaminationId,
      });

      if (saved) {
        return res
          .status(409)
          .json({ message: "Exame já aplicado ao colaborador." });
      }

      const record = await EmployeeHealthExamination.create({
        employee: employeeId,
        healthExamination: healthExaminationId,
        date,
        dueDate,
      });

      res.status(201).json(record);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao vincular exame ao colaborador.",
        details: err.message,
      });
    }
  }

  static async getAllByEmployeeId(req, res) {
    try {
      const { id } = req.params;

      const employeeExams = await EmployeeHealthExamination.find({
        employee: id,
        isActive: true,
      })
        .populate("healthExamination", "title description isActive")
        .select("-__v");

      res.status(200).json(employeeExams);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar exames do colaborador.",
        details: err.message,
      });
    }
  }

  static async deactivate(req, res) {
    try {
      const { examinationId } = req.params;

      const record = await EmployeeHealthExamination.findOne({
        healthExamination: examinationId,
        isActive: true,
      });

      if (!record) {
        return res
          .status(404)
          .json({ error: "Vínculo não encontrado ou já desativado." });
      }

      record.isActive = false;
      await record.save();

      res.status(200).json({ message: "Exame desvinculado com sucesso." });
    } catch (err) {
      res.status(500).json({
        error: "Erro ao desvincular exame.",
        details: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await EmployeeHealthExamination.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Registro não encontrado." });
      }

      res.status(200).json({ message: "Registro deletado com sucesso." });
    } catch (err) {
      res.status(500).json({
        error: "Erro ao deletar o registro.",
        details: err.message,
      });
    }
  }
};
