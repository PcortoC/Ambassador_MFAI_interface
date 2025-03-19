const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Quotidienne', 'Hebdomadaire', 'Mensuelle', 'Spéciale'],
        required: true
    },
    pointsRecompense: {
        type: Number,
        required: true
    },
    recompenseToken: {
        type: Number,
        default: 0
    },
    criteres: [{
        type: String,
        required: true
    }],
    niveauRequis: {
        type: String,
        enum: ['Bronze', 'Argent', 'Or', 'Platine', 'Tous'],
        default: 'Tous'
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    statut: {
        type: String,
        enum: ['Active', 'En attente', 'Terminée', 'Expirée'],
        default: 'Active'
    },
    ambassadeursCompletes: [{
        ambassadeur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ambassador'
        },
        dateCompletion: Date,
        preuve: String
    }],
    ressources: [{
        type: String,
        description: String,
        lien: String
    }]
});

// Méthodes pour le modèle
missionSchema.methods.ajouterCompletion = async function(ambassadeurId, preuve) {
    this.ambassadeursCompletes.push({
        ambassadeur: ambassadeurId,
        dateCompletion: new Date(),
        preuve
    });
    await this.save();
};

missionSchema.methods.estDisponible = function() {
    const maintenant = new Date();
    return this.statut === 'Active' && 
           maintenant >= this.dateDebut && 
           maintenant <= this.dateFin;
};

const Mission = mongoose.model('Mission', missionSchema);

module.exports = Mission; 