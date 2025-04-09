require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");

module.exports = class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.find({}, "-password"); // Exclui a senha dos resultados
      res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
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

    res.status(200).json({ user });
  }

  static async register(req, res) {
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
        return res
          .status(409)
          .json({
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

      res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        user: newUser,
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async updatePassword(req, res) {
    try {
      const { registration, newPassword, confirmPassword } = req.body;

      // Verificando se todos os campos foram informados
      if (!registration || !newPassword || !confirmPassword) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      // Conferindo se as senhas coincidem
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "As senhas não coincidem." });
      }

      // Verificando se o usuário existe
      const user = await User.findOne({ registration });
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Gerando hash da nova senha
      const salt = await bcrypt.genSalt(12);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Atualizando senha do usuário
      user.password = newPasswordHash;
      await user.save();

      res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
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

  static async checkUser(req, res) {
    let currentUser = null;

    if (req.headers.authorization) {
      try {
        const token = getToken(req);
        const userDecoded = jwt.verify(token, process.env.TOKEN_KEY);

        currentUser = await User.findById(userDecoded.id).select(
          "-password -__v"
        );
      } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
      }
    }

    res.status(200).json(currentUser);
  }

  static async editUser(req, res) {
    try {
      const { id } = req.params;
      const { name, registration, role } = req.body;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "ID inválido." });
      }

      if (!name || !registration || !role) {
        return res
          .status(422)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, registration, role },
        { new: true, runValidators: true }
      ).select("-password -__v");

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
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
