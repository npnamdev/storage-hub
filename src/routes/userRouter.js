const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authenticateUser');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');
const cloudinary = require('cloudinary').v2;

router.post('/', authenticateUser, userController.createUser);
router.get('/', authenticateUser, userController.getAllUsers);
router.get('/:id', authenticateUser, userController.getUserById);
router.put('/:id', authenticateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);


router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/auth/logout', authenticateUser, userController.logout);
router.get('/auth/refresh', userController.refreshToken);
router.get('/auth/account', authenticateUser, userController.fetchAccount);


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
