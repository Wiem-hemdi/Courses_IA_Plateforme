const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Autoriser le frontend React à faire des requêtes
app.use(cors({
  origin: 'http://localhost:5173', // adresse du frontend
  credentials: true,
}));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error("Erreur MongoDB :", err));

// Routes principales
app.use('/api/auth', require('./routes/authRoutes'));        // Authentification JWT
app.use('/api/users', require('./routes/userRoutes'));        // Gestion des utilisateurs
app.use('/api/profiles', require('./routes/profileRoutes'));  // Gestion des profils
app.use('/api/courses', require('./routes/courseRoutes'));    // Gestion des cours
app.use('/api/reviews', require('./routes/reviewRoutes'));    // Gestion des avis

// Routes IA
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Route test publique
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API EduPlatform !');
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
