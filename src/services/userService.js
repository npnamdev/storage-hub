const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isEmailAlreadyInUse = async (email) => {
    const existingUser = await User.findOne({ email });
    return existingUser !== null;
};

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

exports.checkUserExists = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

exports.checkPasswordValidity = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

exports.generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

exports.generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

exports.verifyRefreshToken = async (refreshToken) => {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decodedToken && decodedToken.userId) {
        const user = await User.findById(decodedToken.userId);
        return user;
    }
}

// ================================================

exports.createUser = async (data) => {
    try {
        console.log(data);
        const newUser = new User(data);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async (currentPage, pageSize, filters, sortBy, sortOrder) => {
    try {
        let query = {};

        if (filters.email) {
            query.email = { $regex: filters.email, $options: 'i' };
        }

        if (filters.phone) {
            query.phone = { $regex: filters.phone, $options: 'i' };
        }

        if (filters.role) {
            query.role = filters.role;
        }

        if (filters.fullName) {
            query.fullName = { $regex: filters.fullName, $options: 'i' };
        }

        if (filters.isActive) {
            query.isActive = filters.isActive;
        } else {
            query.isActive = true;
        }

        const sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions.createdAt = -1;
        }

        const users = await User.find(query)
            .sort(sortOptions)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        return users;
    } catch (error) {
        throw error;
    }
};

exports.getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
};

exports.updateUser = async (id, data) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

exports.deleteUser = async (id) => {
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        return deleteUser;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
