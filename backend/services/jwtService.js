const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const generateVerificationToken = () => {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    generateToken,
    verifyToken,
    generateVerificationToken
};
