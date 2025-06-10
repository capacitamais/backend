const Task = require("../models/Task");
const ActivityRequiredTraining = require("../models/ActivityRequiredTraining");
const TrainingReceived = require("../models/ReceivedTraining");
const Employee = require("../models/Employee");
const User = require("../models/User");

module.exports = class TaskController {
  // Create Task
  static async create(req, res) {
    try {
      const { name, description, site, dueDate, technician, activities, employees } =
        req.body;

      // Verifica se o técnico existe e é da role "technician"
      const techUser = await User.findOne({
        _id: technician,
        role: "technician",
      });
      if (!techUser)
        return res.status(400).json({ error: "Técnico inválido." });

      // Verifica se o técnico já está atribuído a uma tarefa ativa
      const activeTask = await Task.findOne({ technician, status: true });
      if (activeTask) {
        return res.status(400).json({
          error: `Este técnico já está atribuído a uma tarefa ativa: ${activeTask.name}`,
        });
      }

      // Obtem os requisitos de treinamento para cada activity
      const requiredTrainings = await ActivityRequiredTraining.find({
        activity: { $in: activities },
      });

      // Agrupa os trainings exigidos por atividade
      const requiredTrainingIds = requiredTrainings.map((rt) =>
        String(rt.training)
      );

      // Criação da tarefa
      const task = await Task.create({
        name,
        description,
        site,
        dueDate,
        technician,
        activities,
        employees,
        status: true,
      });

      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar tarefa." });
    }
  }

  // Get all tasks
  static async getAll(req, res) {
    try {
      const { name } = req.query;
      
      let filter = {};

      if(name) {
        filter.name = { $regex: new RegExp(name, "i") }
      };

      const tasks = await Task.find(filter)
        .populate("technician", "name registration")
        .populate("activities", "name")
        .populate("employees", "name registration");
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar tarefas." });
    }
  }

  // Get task by id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id)
        .populate("technician", "_id name registration")
        .populate("activities", "_id name")
        .populate("employees", "_id name registration");

      if (!task)
        return res.status(404).json({ error: "Tarefa não encontrada." });

      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar tarefa." });
    }
  }

  // Get tasks by technician (somente tarefas ativas)
  static async getByTechnician(req, res) {
    try {
      const { technicianId } = req.params;

      const tasks = await Task.find({ technician: technicianId, isActive: true })
        .populate("technician", "name registration")
        .populate("activities", "name")
        .populate("employees", "name registration");

      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar tarefas por técnico." });
    }
  }

  // Update task
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Se for ativar uma tarefa, verificar se o técnico já está atribuído a outra ativa
      if (data.status === true) {
        const taskToUpdate = await Task.findById(id);
        if (!taskToUpdate)
          return res.status(404).json({ error: "Tarefa não encontrada." });

        const activeTask = await Task.findOne({
          technician: taskToUpdate.technician,
          status: true,
          _id: { $ne: id },
        });

        if (activeTask) {
          return res
            .status(400)
            .json({ error: "Este técnico já possui outra tarefa ativa." });
        }
      }

      const updatedTask = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!updatedTask)
        return res.status(404).json({ error: "Tarefa não encontrada." });

      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar tarefa." });
    }
  }

  static async deactivate(req, res) {
    try {
      const { id } = req.params;

      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada." });
      }

      if (task.isActive === false) {
        return res.status(400).json({ error: "A tarefa já está desativada." });
      }

      task.isActive = false;
      await task.save();

      res.status(200).json({ message: "Tarefa desativada com sucesso.", task });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao desativar tarefa.", details: err.message });
    }
  }

  // Delete task
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Tarefa não encontrada." });

      res.status(200).json({ message: "Tarefa removida com sucesso." });
    } catch (err) {
      res.status(500).json({ error: "Erro ao deletar tarefa." });
    }
  }
};
