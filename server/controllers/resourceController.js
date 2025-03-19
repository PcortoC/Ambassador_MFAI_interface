const Resource = require('../models/Resource');

// Obtenir toutes les ressources
exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            niveauRequis: { $in: ['Tous', req.ambassadeur.niveau] }
        }).sort({ dateCreation: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des ressources', error: error.message });
    }
};

// Obtenir une ressource spécifique
exports.getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }

        // Vérifier si l'ambassadeur a le niveau requis
        if (resource.niveauRequis !== 'Tous' && resource.niveauRequis !== req.ambassadeur.niveau) {
            return res.status(403).json({ message: 'Niveau requis non atteint' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la ressource', error: error.message });
    }
};

// Marquer une ressource comme complétée
exports.completeResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Ressource non trouvée' });
        }

        // Vérifier si l'ambassadeur a le niveau requis
        if (resource.niveauRequis !== 'Tous' && resource.niveauRequis !== req.ambassadeur.niveau) {
            return res.status(403).json({ message: 'Niveau requis non atteint' });
        }

        // Ajouter les points à l'ambassadeur
        if (resource.pointsRecompense > 0) {
            req.ambassadeur.points += resource.pointsRecompense;
            await req.ambassadeur.save();
        }

        res.json({ message: 'Ressource marquée comme complétée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la complétion de la ressource', error: error.message });
    }
}; 