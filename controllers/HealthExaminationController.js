const HealthExamination = require("../models/HealthExamination");
const EmployeeHealthExamination = require("../models/EmployeeHealthExamination");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
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
      const { title } = req.query;

      let filter = {};

      if (title) {
        filter.title = { $regex: new RegExp(title, "i") };
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
    static async importFromCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo CSV não enviado." });
    }

    const results = [];
    const filePath = path.resolve(__dirname, "..", "uploads", req.file.filename);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        const createdExams = [];

        for (const row of results) {
          const { title, description } = row;

          if (!title) continue;

          const exam = await HealthExamination.create({
            title,
            description
          });

          createdExams.push(exam);
        }

        fs.unlinkSync(filePath);
        res.status(201).json({
          message: "Importação concluída",
          exams: createdExams,
        });
      });
  } catch (err) {
    res.status(500).json({ error: "Erro ao importar CSV", details: err.message });
  }
}
static async report(req, res) {
  try {
    const exams = await HealthExamination.find().select("-__v");
    res.status(200).json({ reportType: "healthExaminations", total: exams.length, exams });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar relatório de exames", details: err.message });
  }
}
};
