const Training = require("../models/Training");

module.exports = class TrainingController {
  static async create(req, res) {
    try {
      const { trainingTag, description } = req.body;
      const training = await Training.create({ trainingTag, description });
      res.status(201).json(training);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar treinamento", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const trainings = await Training.find();
      res.status(200).json(trainings);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar treinamentos", details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const training = await Training.findById(id);
      if (!training)
        return res.status(404).json({ error: "Treinamento não encontrado" });
      res.status(200).json(training);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar treinamento", details: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { trainingTag, description } = req.body;
      const updated = await Training.findByIdAndUpdate(
        id,
        { trainingTag, description },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ error: "Treinamento não encontrado" });
      res.status(200).json(updated);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar treinamento", details: err.message });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Training.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Treinamento não encontrado" });
      res.status(200).json({ message: "Treinamento removido com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao remover treinamento", details: err.message });
    }
  }
};
