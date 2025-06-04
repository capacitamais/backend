const ActivityRequiredTraining = require("../models/ActivityRequiredTraining");

module.exports = class ActivityRequiredTrainingController {
  static async register(req, res) {
    try {
      const { activityId, trainingId } = req.body;

      const record = await ActivityRequiredTraining.create({
        activity: activityId,
        training: trainingId,
      });

      res.status(201).json(record).select("-__v");
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao vincular treinamento e atividade.", details: err.message });
    }
  }

  static async getAllByActivityId(req, res) {
    try {
      const { id } = req.params;

      const activityTraining = await ActivityRequiredTraining.find({
        activity: id,
        isActive: true,
      }
      )
        .pupulate()
        .select("-__v");
      
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar treinamentos da atividade.",
        details:err.message,
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

      res.status(200).json({ message: "Treinamento desvinculado com sucesso." });
    } catch (err) {
      res.status(500).json({
        error: "Erro ao desvincular treinamento.",
        details: err.message,
      })
    }
  }
};
