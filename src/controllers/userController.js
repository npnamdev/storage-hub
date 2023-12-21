const userService = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(req.body.email);
        if (isEmailAlreadyInUse) {
            return res.status(400).json({ status: 'error', message: "Email is already in use" });
        }

        const hashedPassword = await userService.hashPassword(req.body.password);
        console.log(hashedPassword);

        const savedUser = await userService.createUser({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            profilePicture: req.body.profilePicture,
        });

        res.status(200).json({ status: 'success', data: savedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

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
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, password, ...updateData } = req.body;
        if (email || password) {
            return res.status(400).json({ status: 'error', message: 'Cannot update email or password directly.' });
        }
        const updatedUser = await userService.updateUser(req.params.id, updateData);
        res.status(200).json({ status: 'success', data: updatedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await userService.deleteUser(req.params.id);
        res.status(200).json({ status: 'success', data: deleteUser, message: 'User deleted successfully', });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Auth Controller
exports.register = async (req, res) => {
    try {
        const isEmailAlreadyInUse = await userService.isEmailAlreadyInUse(req.body.email);
        if (isEmailAlreadyInUse) {
            return res.status(400).json({ status: 'error', message: "Email is already in use" });
        }

        const hashedPassword = await userService.hashPassword(req.body.password);
        const savedUser = await userService.createUser({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            profilePicture: req.body.profilePicture,
            role: 'user',
        });

        res.status(200).json({ status: 'success', data: savedUser });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.checkUserExists(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await userService.checkPasswordValidity(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = userService.generateAccessToken(user._id);
        const refreshToken = userService.generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        await userService.saveRefreshTokenToUser(user._id, refreshToken);

        res.status(200).json({ status: 'success', data: { accessToken, user }, message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new Error('No refreshToken found');
        }

        res.clearCookie('refreshToken');

        await userService.removeRefreshToken(refreshToken);

        res.status(200).json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};
