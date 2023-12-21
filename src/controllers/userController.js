const userService = require('../services/userService');
const _ = require('lodash');

exports.createUser = async (req, res) => {
    try {
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(req.body.email);
        if (isEmailAlreadyInUse) {
            return res.status(400).json({ status: 'error', message: "Email is already in use" });
        }

        const hashedPassword = await userService.hashPassword(req.body.password);
        console.log(hashedPassword);

        const savedUser = await userService.createUser({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            profilePicture: req.body.profilePicture,
        });

        res.status(200).json({ status: 'success', data: savedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
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
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, password, ...updateData } = req.body;
        if (email || password) {
            return res.status(400).json({ status: 'error', message: 'Cannot update email or password directly.' });
        }
        const updatedUser = await userService.updateUser(req.params.id, updateData);
        res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await userService.deleteUser(req.params.id);
        res.status(200).json({ status: 'success', data: deleteUser, message: 'User deleted successfully', });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Auth Controller
exports.register = async (req, res) => {
    try {
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(req.body.email);
        if (isEmailAlreadyInUse) {
            return res.status(400).json({ status: 'error', message: "Email is already in use" });
        }

        const hashedPassword = await userService.hashPassword(req.body.password);
        const user = await userService.createUser({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            profilePicture: req.body.profilePicture,
            role: 'user',
        });

        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone']);

        res.status(200).json({ status: 'success', data: userData });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
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
        res.status(200).json({
            status: 'success',
            data: { access_token, user: userData },
            message: 'Login successful'
        });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        // Đoạn này làm sau, phải truyền access_token lên để xóa
        const accessToken = req.user?.access_token; // Giả sử lấy access_token từ req.user
        if (!accessToken) throw { status: 400, message: 'No access_token found in the request' };
        // =======================

        res.clearCookie('refresh_token');
        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
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
        res.status(200).json({
            status: 'success',
            data: { access_token: newAccessToken, user: userData },
            message: 'Token refreshed successfully'
        });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};

exports.fetchAccount = async (req, res) => {
    try {
        // Làm sau
        // Giả định: Thông tin người dùng đã được giải mã từ token và lưu trong req.user
        const user = req.user;
        if (!user) throw { status: 401, message: 'Unauthorized' };
        const userData = _.pick(user, ['_id', 'email', 'fullName', 'profilePicture', 'phone', 'role']);
        res.status(200).json({
            status: 'success',
            data: {
                user: userData
            }
        });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
};
