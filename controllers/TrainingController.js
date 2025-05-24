const Training = require("../models/Training");

module.exports = class TrainingController {
  static async create(req, res) {
    try {
      const { trainingTag, revision, title, description } = req.body;

      const requiredFields = {
        trainingTag: "O código do treinamento é obrigatório.",
        title: "O título do treinamento é obrigatório.",
        description: "A descrição do treinamento é obrigatória.",
      };

      for (const field in requiredFields) {
        if (!req.body[field]) {
          return res.status(422).json({ message: requiredFields[field] });
        }
      }

      const lastTraining = await Training.findOne({
        trainingTag,
        isActive: true,
      }).sort({ revision: -1 });

      let newRevision;
      if (revision !== undefined && revision !== null) {
        newRevision = revision;
      } else if (lastTraining) {
        newRevision = lastTraining.revision + 1;
      } else {
        newRevision = 0;
      }

      if (lastTraining) {
        lastTraining.isActive = false;
        await lastTraining.save();
      }

      const training = await Training.create({
        trainingTag,
        revision: newRevision,
        title,
        description,
        isActive: true,
      });

      res.status(201).json(training.toObject({ versionKey: false }));
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar treinamento", details: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const training = await Training.findById(id).select("-__v");
      if (!training) {
        return res.status(404).json({ error: "Treinamento não encontrado" });
      }
      res.status(200).json(training);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar treinamento", details: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { titleOrTag, isActive, revision } = req.query;

      let filter = {};

      // Filtro por trainingTag ou title
      if (titleOrTag) {
        filter.$or = [
          { trainingTag: { $regex: new RegExp(titleOrTag, "i") } },
          { title: { $regex: new RegExp(titleOrTag, "i") } },
        ];
      }

      // Filtro por isActive (convertendo string para boolean)
      if (isActive === "true") {
        filter.isActive = true;
      } else if (isActive === "false") {
        filter.isActive = false;
      }

      // Filtro por revision (convertendo para número se válido)
      if (revision !== undefined && !isNaN(revision)) {
        filter.revision = Number(revision);
      }

      const trainings = await Training.find(filter).select("-__v");
      res.status(200).json(trainings);
    } catch (err) {
      res.status(500).json({
        error: "Erro ao listar treinamentos",
        details: err.message,
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const updated = await Training.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      ).select("-__v");

      if (!updated) {
        return res.status(404).json({ error: "Treinamento não encontrado" });
      }

      res.status(200).json(updated);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar treinamento", details: err.message });
    }
  }

  // Inativar treinamento (não excluir)
  static async deactivate(req, res) {
    try {
      const { id } = req.params;
      const training = await Training.findById(id);
      if (!training)
        return res.status(404).json({ error: "Treinamento não encontrado" });

      training.isActive = false;
      await training.save();

      res.status(200).json({ message: "Treinamento inativado com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao inativar treinamento", details: err.message });
    }
  }
};
