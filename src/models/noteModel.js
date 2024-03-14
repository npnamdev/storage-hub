const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true},
  content: {type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: { type: [String], default: []},
  isArchived: { type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  importance: { type: Number, default: 0, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  files: [{ data: Buffer, contentType: String }],
  urls: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'completed'], default: 'active' } 
},{ timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

