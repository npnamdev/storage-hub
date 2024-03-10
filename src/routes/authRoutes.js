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
    const imageUrl = req.cloudinaryResult.secure_url;
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
    });
});

router.get('/upload/cloudinary', async (req, res) => {
    try {
        const result = await cloudinary.api.resources({ type: 'upload' });
        res.status(200).json({ data: result });
    } catch (error) {
        console.error('Cloudinary Error:', error);
        res.status(500).json({ message: 'Error retrieving images from Cloudinary', error: error });
    }
});


module.exports = router;
