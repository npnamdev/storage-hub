const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    amount: { type: Number, required: true},
    type: { type: String, required: true, enum: ['collect', 'spend']}
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
