const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    motDePasse: {
        type: String,
        required: true
    },
    niveau: {
        type: String,
        enum: ['Bronze', 'Argent', 'Or', 'Platine'],
        default: 'Bronze'
    },
    points: {
        type: Number,
        default: 0
    },
    referes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    missionsCompletees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }],
    recompenses: [{
        type: {
            type: String,
            enum: ['Token', 'Badge', 'Niveau']
        },
        montant: Number,
        date: Date,
        description: String
    }],
    statistiques: {
        nombreReferes: { type: Number, default: 0 },
        revenusTotaux: { type: Number, default: 0 },
        missionsRealisees: { type: Number, default: 0 }
    },
    dateInscription: {
        type: Date,
        default: Date.now
    },
    derniereConnexion: Date,
    actif: {
        type: Boolean,
        default: true
    }
});

// Méthodes pour le modèle
ambassadorSchema.methods.ajouterPoints = async function(points) {
    this.points += points;
    await this.save();
};

ambassadorSchema.methods.ajouterReferal = async function(userId) {
    this.referes.push(userId);
    this.statistiques.nombreReferes += 1;
    await this.save();
};

ambassadorSchema.methods.ajouterRecompense = async function(recompense) {
    this.recompenses.push({
        ...recompense,
        date: new Date()
    });
    await this.save();
};

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);

module.exports = Ambassador; 