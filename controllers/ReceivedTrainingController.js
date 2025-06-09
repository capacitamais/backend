const fs = require("fs");
const csv = require("csv-parse");
const Employee = require("../models/Employee");
const Training = require("../models/Training");
const ReceivedTraining = require("../models/ReceivedTraining");

function sanitize(value) {
  if (typeof value !== "string") return value;
  return value.replace(/[<>'"`;$\\]/g, "").trim();
}

module.exports = class ReceivedTrainingController {
  static async register(req, res) {
    try {
      const { employeeId, trainingId, date, dueDate } = req.body;

      const saved = await ReceivedTraining.findOne({
        employee: employeeId,
        training: trainingId,
      });

      if (saved) {
        return res
          .status(409)
          .json({ message: "Treinamento já aplicado ao colaborador." });
      }

      const record = await ReceivedTraining.create({
        employee: employeeId,
        training: trainingId,
        date,
        dueDate,
      });

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

      const training = await ReceivedTraining.find({
        employee: id,
        isActive: true,
      })
        .populate("training", "trainingTag title revision")
        .select("-__v");

      res.status(200).json(training);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao buscar treinamentos do colaborador.",
        details: err.message,
      });
    }
  }

  static async deactivate(req, res) {
    try {
      const { receivedTrainingId } = req.params;

      const record = await ReceivedTraining.findOne({
        _id: receivedTrainingId,
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

      const deleted = await ReceivedTraining.findByIdAndDelete(id);

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

  static async import(req, res) {
    try {
      const filePath = req.file?.path;

      if (!filePath) {
        return res.status(400).json({ error: "Arquivo CSV não enviado." });
      }

      const parser = fs.createReadStream(filePath).pipe(
        csv.parse({
          delimiter: ";",
          skipEmptyLines: true,
          trim: true,
          columns: (header) =>
            header.map((col) =>
              col
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "")
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase()
            ),
        })
      );

      const results = [];
      for await (const row of parser) {
        console.log(row);
        const {
          matricula,
          codigotreinamento,
          revisao,
          dataaplicacao,
          validade,
        } = Object.fromEntries(
          Object.entries(row).map(([key, val]) => [key, sanitize(val)])
        );

        if (!matricula || !codigotreinamento || !revisao || !dataaplicacao) {
          results.push({
            matricula,
            codigotreinamento,
            revisao,
            status: "Dados incompletos. Ignorado.",
          });
          continue;
        }

        const employee = await Employee.findOne({ registration: matricula });
        if (!employee) {
          results.push({
            matricula,
            codigotreinamento,
            revisao,
            status: "Colaborador não encontrado.",
          });
          continue;
        }

        const training = await Training.findOne({
          trainingTag: codigotreinamento,
          revision: revisao,
          isActive: true,
        });

        if (!training) {
          results.push({
            matricula,
            codigotreinamento,
            revisao,
            status: "Treinamento não encontrado.",
          });
          continue;
        }

        const existing = await ReceivedTraining.findOne({
          employee: employee._id,
          training: training._id,
        });

        if (existing) {
          results.push({
            matricula,
            codigotreinamento,
            revisao,
            status: "Já cadastrado.",
          });
          continue;
        }

        const newRecord = await ReceivedTraining.create({
          employee: employee._id,
          training: training._id,
          date: new Date(dataaplicacao),
          dueDate: validade ? new Date(validade) : null,
        });

        results.push({
          matricula,
          codigotreinamento,
          revisao,
          status: "Importado com sucesso.",
          _id: newRecord._id,
        });
      }

      fs.unlink(filePath, (err) => {
        if (err) console.error("Erro ao excluir o arquivo:", err);
      });

      res.status(200).json({
        message: "Importação concluída.",
        resultados: results,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erro ao importar os treinamentos.",
        details: err.message,
      });
    }
  }
};
