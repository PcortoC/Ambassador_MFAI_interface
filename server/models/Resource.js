const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Formation', 'Document', 'Vidéo', 'Guide'],
        required: true
    },
    contenu: {
        type: String,
        required: true
    },
    niveauRequis: {
        type: String,
        enum: ['Tous', 'Bronze', 'Argent', 'Or', 'Platine'],
        default: 'Tous'
    },
    pointsRecompense: {
        type: Number,
        default: 0
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateMiseAJour: {
        type: Date,
        default: Date.now
    },
    tags: [{
        type: String,
        trim: true
    }],
    mediaUrl: {
        type: String
    }
});

module.exports = mongoose.model('Resource', resourceSchema); 