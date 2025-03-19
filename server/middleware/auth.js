const jwt = require('jsonwebtoken');
const Ambassador = require('../models/Ambassador');

module.exports = async (req, res, next) => {
    try {
        // Vérifier si le token est présent dans le header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        
        // Récupérer l'ambassadeur
        const ambassadeur = await Ambassador.findById(decoded.id);
        
        if (!ambassadeur) {
            return res.status(401).json({ message: 'Accès refusé. Ambassadeur non trouvé.' });
        }

        // Vérifier si l'ambassadeur est actif
        if (!ambassadeur.actif) {
            return res.status(401).json({ message: 'Accès refusé. Compte désactivé.' });
        }

        // Ajouter l'ambassadeur à la requête
        req.ambassadeur = ambassadeur;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré.' });
        }
        res.status(500).json({ message: 'Erreur d\'authentification', error: error.message });
    }
}; 