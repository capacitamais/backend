require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

//adionar a url do banco no parametro da função connect
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongoose conectado");
}

main().catch((err) => console.log(err));

module.exports = mongoose;
