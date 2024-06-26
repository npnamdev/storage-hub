const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true}
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
