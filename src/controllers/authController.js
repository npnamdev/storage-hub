const userService = require('../services/userService');
const _ = require('lodash');
require('dotenv').config();

/**
 * Đăng ký (Tạo tài khoản người dùng)
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Đăng nhập
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Đăng xuất
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Làm mới token truy cập
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Lấy thông tin tài khoản
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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