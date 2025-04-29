const TrainingReceived = require('../models/TrainingReceived')

module.exports = class TrainingReceivedController {
  static async register(req, res) {
    try {
      const { employeeId, trainingId, date, dueDate } = req.body

      const record = await TrainingReceived.create({
        employee: employeeId,
        training: trainingId,
        date,
        dueDate
      })

      res.status(201).json(record)
    } catch (err) {
      res.status(500).json({ error: 'Erro ao registrar treinamento', details: err.message })
    }
  }
}
