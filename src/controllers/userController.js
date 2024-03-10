const userService = require('../services/userService');
const _ = require('lodash');
require('dotenv').config();

/**
 * Tạo tài khoản quản trị viên nếu chưa tồn tại
 */
exports.createAdminUserIfNotExist = async () => {
    try {
        const isEmailAlreadyUsed = await userService.isEmailAlreadyInUse(process.env.EMAIL_FAKE);
        if (!isEmailAlreadyUsed) {
            const hashedPassword = await userService.hashPassword(process.env.PASS_FAKE);
            await userService.createUser({email: process.env.EMAIL_FAKE, password: hashedPassword});
            console.log('Admin created successfully.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

/**
 * Tạo người dùng mới
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Lấy danh sách tất cả người dùng
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Lấy thông tin người dùng theo ID
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Cập nhật thông tin người dùng
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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

/**
 * Xóa người dùng
 * @param {object} req - Đối tượng yêu cầu từ client
 * @param {object} res - Đối tượng phản hồi gửi đến client
 * @returns {object} - Đối tượng phản hồi với trạng thái và dữ liệu
 */
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