const HealthExamination = require("../models/HealthExamination");
const EmployeeHealthExamination = require("../models/EmployeeHealthExamination");

module.exports = class HealthExaminationController {
  static async create(req, res) {
    try {
      const { title, description } = req.body;

      const exam = await HealthExamination.create({ title, description });

      res.status(201).json(exam);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar exame", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { title, isActive } = req.query;

      let filter = {};

      if (title) {
        filter.title = { $regex: new RegExp(title, "i") };
      }

      // Filtro por isActive (convertendo string para boolean)
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }

      const exams = await HealthExamination.find(filter).select("-__v");

      res.status(200).json(exams);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar exames", details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const exam = await HealthExamination.findById(id);

      if (!exam) return res.status(404).json({ error: "Exame não encontrado" });

      res.status(200).json(exam);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar exame", details: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      const { title, description, isActive } = req.body;

      const updated = await HealthExamination.findByIdAndUpdate(
        id,
        { title, description, isActive },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ error: "Exame não encontrado" });

      res.status(200).json(updated);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar exame", details: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o exame existe
      const exam = await HealthExamination.findById(id);
      if (!exam) {
        return res.status(404).json({ error: "Exame não encontrado" });
      }

      // Deleta todos os registros relacionados ao exame
      await EmployeeHealthExamination.deleteMany({ healthExamination: id });

      // Deleta o exame
      await HealthExamination.findByIdAndDelete(id);

      res
        .status(200)
        .json({ message: "Exame e vínculos removidos com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao remover exame", details: err.message });
    }
  }
};
