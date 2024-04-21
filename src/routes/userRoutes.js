const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middlewares/authenticateUser');

router.post('/', authenticateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', authenticateUser, userController.getUserById);
router.put('/:id', authenticateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
