require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserFromToken = require("../helpers/get-user-from-token");

module.exports = class UserController {
  static async checkUser(req, res) {
    try {
      const user = await getUserFromToken(req);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        registration: user.registration,
        role: user.role,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado.",
      });
      return;
    }

    res.status(200).json( user );
  }

  static async getAll(req, res) {
    try {
      const { nameOrRegistration, role } = req.query;

      let filter = {};

      if (nameOrRegistration) {
        filter.$or = [
          { name: { $regex: new RegExp(nameOrRegistration, "i") } },
          { registration: { $regex: new RegExp(nameOrRegistration, "i") } },
        ];
      }

      if (role !== undefined && isNaN(role)){
        filter.role = role;
      }

      const users = await User.find(filter).select("-password -__v"); // Exclui a senha dos resultados
      res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async create(req, res) {
    try {
      const { name, registration, role } = req.body;

      // Verificando campos obrigatórios
      const requiredFields = {
        name: "Usuário deve ter um nome.",
        registration: "Usuário deve ter matrícula.",
        role: "Usuário deve ter um papel definido.",
      };

      for (const field in requiredFields) {
        if (!req.body[field]) {
          return res.status(422).json({ message: requiredFields[field] });
        }
      }

      // Verificando se a matrícula já existe
      const registrationChecked = await UserController.checkRegistration(
        registration
      );
      if (registrationChecked) {
        return res.status(409).json({
          message: `Matrícula ${registration} já utilizada pelo usuário ${registrationChecked}.`,
        });
      }

      // Criando senha padrão (nome + matrícula)
      const defaultPassword = `${name}${registration}`;

      // Gerando hash da senha
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      // Criando novo usuário
      const newUser = new User({
        name,
        registration,
        role,
        password: passwordHash,
      });

      await newUser.save();

      // Convertendo para objeto e removendo campos sensíveis
      const userResponse = newUser.toObject();
      delete userResponse.password;
      delete userResponse.__v;

      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async login(req, res) {
    const { registration, password } = req.body;

    // Verificando se todos os campos foram informados
    if (!registration || !password) {
      return res
        .status(422)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    // Verificando se o usuário existe
    const user = await User.findOne({ registration });

    if (!user) {
      return res.status(404).json({ message: "Credenciais inválidas." });
    }

    const passwordChecked = await UserController.checkPassword(
      password,
      user.password
    );

    if (!passwordChecked) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    createUserToken(user, req, res);
  }

  static async updatePassword(req, res) {
    try {
      const { newPassword, confirmPassword } = req.body;

      if (!newPassword || !confirmPassword) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "As senhas não coincidem." });
      }

      const user = await getUserFromToken(req);

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const { name, registration, role } = req.body;

      if (!name || !registration || !role) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      user.name = name;
      user.registration = registration;
      user.role = role;

      await user.save();

      const updatedUser = await User.findById(user._id).select(
        "-password -__v"
      );

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async checkRegistration(registration) {
    const userExist = await User.findOne({ registration });
    return userExist ? userExist.name : null;
  }

  static async checkPassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
  }
};
