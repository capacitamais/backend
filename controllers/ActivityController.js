const Activity = require("../models/Activity");

module.exports = class ActivityController {
  static async create(req, res) {
    try {
      const { name, description } = req.body;

      const activity = await Activity.create({ name, description });

      res.status(201).json(activity);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar atividade", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { name } = req.query;

      let filter = {};

      if (name) {
        filter.name = { $regex: new RegExp(name, "i") };
      }
      const activities = await Activity.find(filter).select("-__v");
      res.status(200).json(activities);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar atividades", details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);
      if (!activity)
        return res.status(404).json({ error: "Atividade não encontrada" });
      res.status(200).json(activity);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar atividade", details: err.message });
    }
  }

  static async getByName(req, res) {
    try {
      const { name } = req.params;
      const activity = await Activity.findOne({ name });
      res.status(200).json(activity);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar atividade", details: err.message });
    }
  }

  static async listRequiredTrainingByActivity(req, res) {
    try {
      const { activityId } = req.params;
      const records = await ActivityRequiredTraining.find({
        activity: activityId,
      }).populate("training");

      res.status(200).json(records);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar treinamentos", details: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, isActive } = req.body;
      
      const updated = await Activity.findByIdAndUpdate(
        id,
        { name, description, isActive },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ error: "Atividade não encontrada" });

      res.status(200).json(updated);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar atividade", details: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Activity.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Atividade não encontrada" });
      res.status(200).json({ message: "Atividade removida com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao remover atividade", details: err.message });
    }
  }
};
