const jwt = require('jsonwebtoken');
const jswSecret = process.env.JWT_SECRET
const refreshSecret = process.env.REFRESH_SECRET

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, jswSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '30d' });
    return { accessToken, refreshToken };
}

module.exports = generateTokens