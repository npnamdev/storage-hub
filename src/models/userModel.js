const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin', 'editor', 'moderator'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;