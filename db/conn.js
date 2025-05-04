const mongoose = require('mongoose');

// Define a configuração de strictQuery para evitar o aviso de depreciação
mongoose.set('strictQuery', true); // ou false, se preferir

async function connectToDatabase() {
  // Impede a conexão se estiver rodando testes
  if (process.env.NODE_ENV === 'test') {
    console.log('Ambiente de teste detectado: conexão com o banco pulada.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongoose conectado');
  } catch (error) {
    console.log('Erro na conexão:', error);
  }
}

module.exports = connectToDatabase;
