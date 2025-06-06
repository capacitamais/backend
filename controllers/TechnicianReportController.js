const Task = require("../models/Task");
const ActivityRequiredTraining = require("../models/ActivityRequiredTraining");
const ReceivedTraining = require("../models/ReceivedTraining");
const EmployeeHealthExamination = require("../models/EmployeeHealthExamination");
const getUserFromToken = require("../helpers/get-user-from-token");

module.exports = class TechnicianReportController {
  static async getByTechnician(req, res) {
    try {
      const user = await getUserFromToken(req);

      const task = await Task.findOne({
        technician: user._id,
        isActive: true,
      })
        .populate("activities")
        .populate("employees");

      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      // Buscar treinamentos obrigatórios por atividade
      const requiredTrainingsByActivity = {};
      for (const activity of task.activities) {
        const requiredTrainings = await ActivityRequiredTraining.find({
          activity: activity._id,
          isActive: true,
        }).populate("training");

        requiredTrainingsByActivity[activity._id.toString()] =
          requiredTrainings.map((rt) => ({
            id: rt.training._id,
            trainingTag: rt.training.trainingTag,
            revision: rt.training.revision,
            name: rt.training.title,
            date: rt.training.createdAt,
          }));
      }

      // Buscar dados dos colaboradores
      const employeeData = [];
      for (const employee of task.employees) {
        const trainings = await ReceivedTraining.find({
          employee: employee._id,
          isActive: true,
        }).populate("training");

        const examinations = await EmployeeHealthExamination.find({
          employee: employee._id,
          isActive: true,
        }).populate("healthExamination");

        employeeData.push({
          registration: employee.registration,
          name: employee.name,
          trainingReceived: trainings.map((t) => ({
            id: t._id,
            trainingTag: t.training.trainingTag,
            revision: t.training.revision,
            date: t.date,
            dueDate: t.dueDate || "N/A",
          })),
          employeeHealthExamination: examinations.map((e) => ({
            id: e._id,
            title: e.healthExamination.title,
            dueDate: e.dueDate || "",
          })),
        });
      }

      const report = {
        report: {
          date: new Date().toISOString(),
          task: {
            id: task._id,
            name: task.name,
            description: task.description,
            site: task.site,
            createdAt: task.createdAt,
            dueDate: task.dueDate,
            activities: task.activities.map((activity) => ({
              id: activity._id,
              name: activity.name,
              requiredTraining:
                requiredTrainingsByActivity[activity._id.toString()],
            })),
            employees: employeeData,
          },
        },
      };

      return res.status(200).json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar relatório" });
    }
  }
};
