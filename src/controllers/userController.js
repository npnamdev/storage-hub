const userService = require('../services/userService');
const _ = require('lodash');
require('dotenv').config();


exports.createAdminUserIfNotExist = async () => {
    try {
        const isEmailAlreadyUsed = await userService.isEmailAlreadyInUse(process.env.EMAIL_FAKE);
        if (!isEmailAlreadyUsed) {
            await userService.createUser({ 
                email: process.env.EMAIL_FAKE, password: process.env.PASS_FAKE, role: 'admin' 
            });
            console.log('Admin created successfully.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};


exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, profilePicture } = req.body;
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(email);
        if (isEmailAlreadyInUse) throw { status: 400, message: 'Email is already in use' };
        const hashedPassword = await userService.hashPassword(password);
        const savedUser = await userService.createUser(
            { fullName, email, password: hashedPassword, phone, profilePicture }
        );
        return res.status(200).json({
            status: 'success',
            message: 'User created successfully',
            data: savedUser,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const filters = {
        email: req.query.email,
        phone: req.query.phone,
        role: req.query.role,
        fullName: req.query.fullName,
        isActive: req.query.isActive,
    };

    const sortBy = req.query.sortBy || '';
    const sortOrder = req.query.sortOrder || 'desc';

    try {
        const users = await userService.getAllUsers(currentPage, pageSize, filters, sortBy, sortOrder);
        const usersWithoutPassword = users.map(user => _.pick(user, ['_id', 'fullName', 'email', 'phone', 'profilePicture', 'isActive', 'role', 'createdAt', 'updatedAt', '__v']));

        return res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: usersWithoutPassword,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        return res.status(200).json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { email, password, ...updateData } = req.body;
        if (email || password) throw { status: 400, message: 'Invalid update request' };
        const updatedUser = await userService.updateUser(req.params.id, updateData);
        return res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await userService.deleteUser(req.params.id);
        return res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
            data: deleteUser,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};


// Auth Controller
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phone, profilePicture } = req.body;
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(email);
        if (isEmailAlreadyInUse) throw { status: 400, message: 'Email is already in use' };
        const hashedPassword = await userService.hashPassword(password);
        const user = await userService.createUser({
            fullName, email, password: hashedPassword, phone, profilePicture, role: 'user'
        });
        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone']);
        return res.status(200).json({
            status: 'success',
            message: 'User registered successfully',
            data: userData,
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.checkUserExists(email);
        if (!user) throw { status: 401, message: 'Invalid email or password' };
        const isPasswordValid = await userService.checkPasswordValidity(password, user.password);
        if (!isPasswordValid) throw { status: 401, message: 'Invalid email or password' };
        const access_token = userService.generateAccessToken(user._id);
        const refresh_token = userService.generateRefreshToken(user._id);
        res.cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone', 'role']);
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: { access_token, user: userData },
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        return res.clearCookie('refresh_token').status(200).json({
            status: 'success',
            message: 'Logout successful'
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) throw { status: 403, message: 'Refresh token not provided' };
        const user = await userService.verifyRefreshToken(refreshToken);
        if (!user) throw { status: 401, message: 'Invalid refresh token' };
        const newAccessToken = userService.generateAccessToken(user._id);
        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone', 'role']);
        return res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: { access_token: newAccessToken, user: userData },
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.fetchAccount = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.userId);
        if (!user) throw { status: 401, message: 'Unauthorized' };
        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone', 'role']);
        return res.status(200).json({
            status: 'success',
            message: 'User data fetched successfully',
            data: { user: userData },
        });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};