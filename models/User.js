// models/User.js
const mongoose = require('mongoose');
const connectToDatabase = require('../db/conn');

connectToDatabase(); // conecta com o banco

const { Schema } = mongoose;

const User = mongoose.model(
  'User',
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      registration: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = User;
