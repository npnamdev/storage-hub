const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized - No accessToken provided'
        });
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Invalid accessToken'
            });
        }

        if (!decoded || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Expired or invalid accessToken'
            });
        }

        req.user = decoded;
        next();
    });
};

module.exports = authenticateUser;
