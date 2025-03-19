const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import des routes
const ambassadorRoutes = require('./routes/ambassadorRoutes');
const missionRoutes = require('./routes/missionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

// Configuration des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/make-flouss-ambassador', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/ambassadeurs', ambassadorRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/ressources', resourceRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Make Flouss Ambassador' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 