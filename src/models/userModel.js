const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin', 'editor', 'moderator'], default: 'user' },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String },
        nationality: { type: String }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
