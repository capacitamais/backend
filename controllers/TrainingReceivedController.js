const TrainingReceived = require("../models/ReceivedTraining");

module.exports = class TrainingReceivedController {
  static async register(req, res) {
    try {
      const { employeeId, trainingId, date, dueDate } = req.body;

      const record = await TrainingReceived.create({
        employee: employeeId,
        training: trainingId,
        date,
        dueDate,
      }).select("-__v");

      res.status(201).json(record);

    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao registrar treinamento", details: err.message });
    }
  }

  static async getAllByEmployeeId(req, res) {
    try {
      const { id } = req.params;

      const training = await TrainingReceived.find({
        employee: id,
        isActive: true,
      })
        .populate("training", "trainingTag title revision")
        .select("-__v");

      res.status(200).json(training)
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar treinamentos do colaborador.",
        details: err.message,
      });
    }
  }

  static async deactivate(req, res) {
      try {
        const { trainingId } = req.params;
  
        const record = await TrainingReceived.findOne({
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
};
