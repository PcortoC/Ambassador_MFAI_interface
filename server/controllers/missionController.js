const Mission = require('../models/Mission');
const Ambassador = require('../models/Ambassador');

// Créer une nouvelle mission
exports.creerMission = async (req, res) => {
    try {
        const mission = new Mission(req.body);
        await mission.save();
        res.status(201).json(mission);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la mission', error: error.message });
    }
};

// Obtenir toutes les missions disponibles
exports.getMissionsDisponibles = async (req, res) => {
    try {
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id);
        const missions = await Mission.find({
            niveauRequis: { $in: ['Tous', ambassadeur.niveau] },
            statut: 'Active',
            dateDebut: { $lte: new Date() },
            dateFin: { $gte: new Date() }
        });

        res.json(missions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des missions', error: error.message });
    }
};

// Obtenir une mission spécifique
exports.getMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }
        res.json(mission);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la mission', error: error.message });
    }
};

// Compléter une mission
exports.completerMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id);

        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        if (!mission.estDisponible()) {
            return res.status(400).json({ message: 'Cette mission n\'est plus disponible' });
        }

        // Vérifier si l'ambassadeur a déjà complété cette mission
        const dejaCompletee = mission.ambassadeursCompletes.some(
            completion => completion.ambassadeur.toString() === ambassadeur._id.toString()
        );

        if (dejaCompletee) {
            return res.status(400).json({ message: 'Vous avez déjà complété cette mission' });
        }

        // Ajouter la preuve de complétion
        await mission.ajouterCompletion(ambassadeur._id, req.body.preuve);

        // Mettre à jour les statistiques de l'ambassadeur
        ambassadeur.missionsCompletees.push(mission._id);
        ambassadeur.statistiques.missionsRealisees += 1;
        await ambassadeur.ajouterPoints(mission.pointsRecompense);

        // Ajouter la récompense en tokens si applicable
        if (mission.recompenseToken > 0) {
            await ambassadeur.ajouterRecompense({
                type: 'Token',
                montant: mission.recompenseToken,
                description: `Récompense pour la mission: ${mission.titre}`
            });
        }

        res.json({
            message: 'Mission complétée avec succès',
            mission,
            recompense: {
                points: mission.pointsRecompense,
                tokens: mission.recompenseToken
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la complétion de la mission', error: error.message });
    }
};

// Obtenir l'historique des missions d'un ambassadeur
exports.getHistoriqueMissions = async (req, res) => {
    try {
        const ambassadeur = await Ambassador.findById(req.ambassadeur.id)
            .populate({
                path: 'missionsCompletees',
                populate: {
                    path: 'ambassadeursCompletes',
                    match: { ambassadeur: req.ambassadeur.id }
                }
            });

        res.json(ambassadeur.missionsCompletees);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error: error.message });
    }
};

// Mettre à jour une mission
exports.updateMission = async (req, res) => {
    try {
        const mission = await Mission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        res.json(mission);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la mission', error: error.message });
    }
};

// Supprimer une mission
exports.supprimerMission = async (req, res) => {
    try {
        const mission = await Mission.findByIdAndDelete(req.params.id);

        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        res.json({ message: 'Mission supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la mission', error: error.message });
    }
}; 