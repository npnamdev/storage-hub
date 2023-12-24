const userService = require('../services/userService');
const _ = require('lodash');


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
            data: savedUser,
            message: 'User created successfully'
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
        return res.status(200).json({
            status: 'success',
            data: users,
            message: 'Users retrieved successfully'
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
            data: user,
            message: 'User retrieved successfully'
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
            data: updatedUser,
            message: 'User updated successfully'
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
            data: deleteUser,
            message: 'User deleted successfully'
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
            data: userData,
            message: 'User registered successfully'
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
            data: { access_token, user: userData },
            message: 'Login successful'
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
            data: { access_token: newAccessToken, user: userData },
            message: 'Token refreshed successfully'
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
        return res.status(200).json({ status: 'success', data: { user: userData } });
    } catch (error) {
        return res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

// Viết thêm

// API đổi mật khẩu
// app.put('/api/change-password/:userId', (req, res) => {
//     const userId = parseInt(req.params.userId, 10);
//     const { newPassword } = req.body;

//     // Tìm người dùng trong mảng
//     const user = users.find((u) => u.id === userId);

//     if (!user) {
//         return res.status(404).json({ error: 'Người dùng không tồn tại' });
//     }

//     // Đổi mật khẩu
//     user.password = newPassword;

//     res.json({ message: 'Đổi mật khẩu thành công' });
// });
