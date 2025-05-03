const jwt = require("jsonwebtoken");
const User = require("../models/User");
const getToken = require("./get-token");

async function getUserFromToken(req) {
  if (!req.headers.authorization) {
    throw new Error("Token não fornecido.");
  }

  const token = getToken(req);
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return user;
}

module.exports = getUserFromToken;
