const ActivityRequiredTraining = require("../models/ActivityRequiredTraining");

module.exports = class ActivityRequiredTrainingController {
  static async register(req, res) {
    try {
      const { activityId, trainingId } = req.body;

      const saved = await ActivityRequiredTraining.findOne({
        activity: activityId,
        training: trainingId,
      });

      if(saved) {
        return res
          .status(409)
          .json({ message: "Treinamento já aplicado à tarefa."});
      }

      const record = await ActivityRequiredTraining.create({
        activity: activityId,
        training: trainingId,
      });

      res.status(201).json(record);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao vincular treinamento e atividade.",
        details: err.message,
      });
    }
  }

  static async getAllByActivityId(req, res) {
    try {
      const { id } = req.params;

      const activityTraining = await ActivityRequiredTraining.find({
        activity: id,
        isActive: true,
      })
        .populate("training", "trainingTag title revision")
        .select("-__v");

      res.status(200).json(activityTraining);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar treinamentos da atividade.",
        details: err.message,
      });
    }
  }

  static async deactivate(req, res) {
    try {
      const { trainingId } = req.params;

      const record = await ActivityRequiredTraining.findOne({
        training: trainingId,
        isActive: true,
      });

      if (!record) {
        return res
          .status(404)
          .json({ error: "Vínculo não encontrado ou já desativado." });
      }

      record.isActive = false;
      await record.save();

      res
        .status(200)
        .json({ message: "Treinamento desvinculado com sucesso." });
    } catch (err) {
      res.status(500).json({
        error: "Erro ao desvincular treinamento.",
        details: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await ActivityRequiredTraining.findByIdAndDelete(id);

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
