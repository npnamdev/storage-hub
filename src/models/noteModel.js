const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true},
  content: {type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  isArchived: { type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  importance: { type: Number, default: 0, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' } 
},{ timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

