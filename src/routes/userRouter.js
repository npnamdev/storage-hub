const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Auth
router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.get('/auth/refresh', userController.refreshToken);
router.get('/auth/account', userController.fetchAccount);

module.exports = router;
