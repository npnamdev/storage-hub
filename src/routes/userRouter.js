const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authenticateUser');

// User
router.post('/', authenticateUser, userController.createUser);
router.get('/', authenticateUser, userController.getAllUsers);
router.get('/:id', authenticateUser, userController.getUserById);
router.put('/:id', authenticateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Auth
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/auth/logout', authenticateUser, userController.logout);
router.get('/auth/refresh', authenticateUser, userController.refreshToken);
router.get('/auth/account', authenticateUser, userController.fetchAccount);

module.exports = router;
