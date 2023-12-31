const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authenticateUser');
const uploadToCloudinary = require('../middlewares/uploadToCloudinary');


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


router.post('/upload-cloudinary', uploadToCloudinary, (req, res) => {
    const imageUrl = req.cloudinaryResult.secure_url;
    res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
    });
});


module.exports = router;
