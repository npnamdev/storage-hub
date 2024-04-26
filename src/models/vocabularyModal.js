const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true},
    meaning: { type: String, required: true},
    topic: {type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true}
}, { timestamps: true });

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

module.exports = Vocabulary;
