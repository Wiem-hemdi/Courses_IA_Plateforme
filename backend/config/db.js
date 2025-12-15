const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connexion à MongoDB réussie !');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    // Quitter le processus avec un code d'erreur
    process.exit(1);
  }
};

module.exports = connectDB;
