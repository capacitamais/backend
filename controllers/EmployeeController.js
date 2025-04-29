const Employee = require("../models/Employee");
const TrainingReceived = require("../models/TrainingReceived");

module.exports = class EmployeeController {
  static async create(req, res) {
    try {
      const { name, registration } = req.body;
      const employee = await Employee.create({ name, registration });
      res.status(201).json(employee);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar funcionário", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao listar funcionários", details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);
      if (!employee)
        return res.status(404).json({ error: "Funcionário não encontrado" });
      res.status(200).json(employee);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar funcionário", details: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, registration } = req.body;
      const updated = await Employee.findByIdAndUpdate(
        id,
        { name, registration },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ error: "Funcionário não encontrado" });
      res.status(200).json(updated);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar funcionário", details: err.message });
    }
  }

  static async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Employee.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ error: "Funcionário não encontrado" });
      res.status(200).json({ message: "Funcionário removido com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao remover funcionário", details: err.message });
    }
  }

  static async getEmployeeByRegistrationOrName(req, res) {
    try {
      const { registrationOrName } = req.params;
      const employee = await Employee.findOne({
        $or: [
          { registration: registrationOrName },
          { name: registrationOrName },
        ],
      });
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar funcionário por matrícula",
        details: err.message,
      });
    }
  }

  static async listTrainingReceivedByEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const records = await TrainingReceived.find({
        employee: employeeId,
      }).populate("training");

      res.status(200).json(records);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar treinamentos", details: err.message });
    }
  }
};
