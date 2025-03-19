const Ambassador = require('../models/Ambassador');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription d'un nouvel ambassadeur
exports.inscription = async (req, res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        // Vérifier si l'ambassadeur existe déjà
        const ambassadeurExistant = await Ambassador.findOne({ email });
        if (ambassadeurExistant) {
            return res.status(400).json({ message: 'Un ambassadeur avec cet email existe déjà' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const motDePasseHash = await bcrypt.hash(motDePasse, salt);

        // Créer le nouvel ambassadeur
        const ambassadeur = new Ambassador({
            nom,
            email,
            motDePasse: motDePasseHash
        });

        await ambassadeur.save();

        // Générer le token JWT
        const token = jwt.sign(
            { id: ambassadeur._id },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            ambassadeur: {
                id: ambassadeur._id,
                nom: ambassadeur.nom,
                email: ambassadeur.email,
                niveau: ambassadeur.niveau
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
    }
};

// Connexion d'un ambassadeur
exports.connexion = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // Vérifier si l'ambassadeur existe
        const ambassadeur = await Ambassador.findOne({ email });
        if (!ambassadeur) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(motDePasse, ambassadeur.motDePasse);
        if (!motDePasseValide) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Mettre à jour la dernière connexion
        ambassadeur.derniereConnexion = new Date();
        await ambassadeur.save();

        // Générer le token JWT
        const token = jwt.sign(
            { id: ambassadeur._id },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            ambassadeur: {
                id: ambassadeur._id,
                nom: ambassadeur.nom,
                email: ambassadeur.email,
                niveau: ambassadeur.niveau
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};

// Obtenir le profil d'un ambassadeur
exports.getProfil = async (req, res) => {
    try {
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id)
            .select('-motDePasse')
            .populate('missionsCompletees')
            .populate('referes');

        if (!ambassadeur) {
            return res.status(404).json({ message: 'Ambassadeur non trouvé' });
        }

        res.json(ambassadeur);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
    }
};

// Mettre à jour le profil d'un ambassadeur
exports.updateProfil = async (req, res) => {
    try {
        const { nom, email } = req.body;
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id);

        if (!ambassadeur) {
            return res.status(404).json({ message: 'Ambassadeur non trouvé' });
        }

        // Mettre à jour les champs
        if (nom) ambassadeur.nom = nom;
        if (email) ambassadeur.email = email;

        await ambassadeur.save();

        res.json({
            message: 'Profil mis à jour avec succès',
            ambassadeur: {
                id: ambassadeur._id,
                nom: ambassadeur.nom,
                email: ambassadeur.email,
                niveau: ambassadeur.niveau
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
    }
};

// Obtenir les statistiques d'un ambassadeur
exports.getStatistiques = async (req, res) => {
    try {
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id)
            .select('statistiques points recompenses');

        if (!ambassadeur) {
            return res.status(404).json({ message: 'Ambassadeur non trouvé' });
        }

        res.json(ambassadeur);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
    }
}; 