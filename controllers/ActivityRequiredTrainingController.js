const ActivityRequiredTraining = require("../models/ActivityRequiredTraining");

module.exports = class ActivityRequiredTrainingController {
  static async register(req, res) {
    try {
      const { activityId, trainingId } = req.body;

      const record = await ActivityRequiredTraining.create({
        activity: activityId,
        training: trainingId,
      });

      res.status(201).json(record);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao vincular treinamento e atividade.", details: err.message });
    }
  }
};
