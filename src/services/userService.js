const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * Kiểm tra xem một địa chỉ email đã được sử dụng trước đó hay chưa
 * @param {string} email - Địa chỉ email cần kiểm tra
 * @returns {Promise<boolean>} - Trả về true nếu email đã được sử dụng, ngược lại trả về false
 */
exports.isEmailAlreadyInUse = async (email) => {
    const existingUser = await User.findOne({ email });
    return existingUser !== null;
};

/**
 * Mã hóa mật khẩu
 * @param {string} password - Mật khẩu cần mã hóa
 * @returns {Promise<string>} - Mật khẩu đã được mã hóa
 */
exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

/**
 * Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu hay không
 * @param {string} email - Địa chỉ email của người dùng cần kiểm tra
 * @returns {Promise<object|null>} - Thông tin người dùng nếu tồn tại, null nếu không tồn tại
 */
exports.checkUserExists = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

/**
 * Kiểm tra tính hợp lệ của mật khẩu
 * @param {string} password - Mật khẩu người dùng nhập vào
 * @param {string} hashedPassword - Mật khẩu đã được mã hóa trong cơ sở dữ liệu
 * @returns {Promise<boolean>} - Trả về true nếu mật khẩu hợp lệ, ngược lại trả về false
 */
exports.checkPasswordValidity = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Tạo mã thông báo truy cập
 * @param {string} userId - ID của người dùng
 * @returns {string} - Mã thông báo truy cập được tạo
 */
exports.generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

/**
 * Tạo mã thông báo làm mới
 * @param {string} userId - ID của người dùng
 * @returns {string} - Mã thông báo làm mới được tạo
 */
exports.generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

/**
 * Xác minh mã thông báo làm mới
 * @param {string} refreshToken - Mã thông báo làm mới cần được xác minh
 * @returns {Promise<object|null>} - Thông tin người dùng liên kết với mã thông báo nếu hợp lệ, ngược lại trả về null
 */
exports.verifyRefreshToken = async (refreshToken) => {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decodedToken && decodedToken.userId) {
        const user = await User.findById(decodedToken.userId);
        return user;
    }
};

/**
 * Tạo mới một người dùng
 * @param {object} data - Thông tin của người dùng mới
 * @returns {Promise<object>} - Thông tin người dùng đã được lưu trong cơ sở dữ liệu
 */
exports.createUser = async (data) => {
    try {
        const newUser = new User(data);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Lấy tất cả người dùng
 * @param {number} currentPage - Trang hiện tại
 * @param {number} pageSize - Kích thước của trang
 * @param {object} filters - Các bộ lọc
 * @param {string} sortBy - Thuộc tính để sắp xếp theo
 * @param {string} sortOrder - Thứ tự sắp xếp ('asc' hoặc 'desc')
 * @returns {Promise<Array<object>>} - Danh sách người dùng
 */
exports.getAllUsers = async () => {
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        throw error;
    }
};

/**
 * Lấy thông tin của một người dùng dựa trên ID
 * @param {string} id - ID của người dùng cần lấy thông tin
 * @returns {Promise<object|null>} - Thông tin người dùng nếu tồn tại, ngược lại trả về null
 */
exports.getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Cập nhật thông tin của một người dùng
 * @param {string} id - ID của người dùng cần cập nhật
 * @param {object} data - Dữ liệu mới cần cập nhật
 * @returns {Promise<object|null>} - Thông tin người dùng sau khi đã được cập nhật, hoặc null nếu không tìm thấy người dùng
 */
exports.updateUser = async (id, data) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Xóa một người dùng khỏi cơ sở dữ liệu
 * @param {string} id - ID của người dùng cần xóa
 * @returns {Promise<object|null>} - Thông tin của người dùng đã bị xóa, hoặc null nếu không tìm thấy người dùng
 */
exports.deleteUser = async (id) => {
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        return deleteUser;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
