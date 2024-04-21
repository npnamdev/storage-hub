const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateUser = require('../middlewares/authenticateUser');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');
const cloudinary = require('cloudinary').v2;

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateUser, authController.logout);
router.get('/refresh', authController.refreshToken);
router.get('/account', authenticateUser, authController.fetchAccount);


// Đăng ký (Register)
// Đăng nhập (Login)
// Đăng xuất (Logout)
// Quên mật khẩu (Forgot Password)
// Đổi mật khẩu (Change Password
// Cập nhật thông tin tài khoản (Account Management)
// Reset Mật khẩu (Reset Password)
// Xác thực Email (Email Verification)


router.post('/upload/cloudinary', uploadToCloudinary, (req, res) => {
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: req.cloudinaryResult,
    });
});

router.get('/upload/cloudinary', async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            max_results: 1000, // Số lượng tệp tối đa bạn muốn lấy trong một lần yêu cầu
            next_cursor: null // Không có next_cursor để chỉ định vị trí bắt đầu
        });

        res.status(200).json({ data: result.resources });
    } catch (error) {
        console.error('Cloudinary Error:', error);
        res.status(500).json({ message: 'Error retrieving images from Cloudinary', error: error });
    }
});




module.exports = router;
