const Employee = require("../models/Employee");
const TrainingReceived = require("../models/ReceivedTraining");

module.exports = class EmployeeController {
  static async create(req, res) {
    try {
      const { name, registration, isActive } = req.body;
      const employee = await Employee.create({ name, registration, isActive });
      res.status(201).json(employee);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar funcionário", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { nameOrRegistration, isActive } = req.query;

      let filter = {};

      if (nameOrRegistration) {
        filter.$or = [
          { name: { $regex: new RegExp(nameOrRegistration, "i") } },
          { registration: { $regex: new RegExp(nameOrRegistration, "i") } },
        ];
      }

      // Filtro por isActive (convertendo string para boolean)
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }

      const employees = await Employee.find(filter).select("-__v");
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
      const { name, registration, isActive } = req.body;
      const updated = await Employee.findByIdAndUpdate(
        id,
        { name, registration, isActive },
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

  static async delete(req, res) {
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
        error: "Erro ao buscar colaborador por matrícula",
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
