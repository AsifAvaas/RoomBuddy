const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateTokens');
const jswSecret = process.env.JWT_SECRET
const refreshSecret = process.env.REFRESH_SECRET
const isProduction = process.env.NODE_ENV === 'production';

const authMiddleware = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No access token' });
        }


        jwt.verify(accessToken, jswSecret, (err, decoded) => {
            if (err) {
                // ⏰ Access token expired → try refresh token
                if (err.name === 'TokenExpiredError') {
                    if (!refreshToken) {
                        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
                    }

                    // Try verifying refresh token
                    jwt.verify(refreshToken, refreshSecret, (refreshErr, refreshDecoded) => {
                        if (refreshErr) {
                            // ❌ Both tokens invalid → logout user
                            res.clearCookie('accessToken');
                            res.clearCookie('refreshToken');
                            return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
                        }

                        // 🔄 Refresh token valid → issue new access token
                        const { accessToken: newAccessToken } = generateTokens(refreshDecoded.userId);

                        res.cookie('accessToken', newAccessToken, {
                            httpOnly: true,
                            secure: isProduction,
                            sameSite: isProduction ? 'none' : 'lax',
                            maxAge: 15 * 60 * 1000
                        });

                        // attach userId for downstream routes
                        req.user = { id: refreshDecoded.userId };
                        next();
                    });
                } else {
                    return res.status(401).json({ success: false, message: 'Invalid token' });
                }
            } else {
                // ✅ Access token valid
                req.user = { id: decoded.userId };
                next();
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Authentication error' });
    }
};

module.exports = authMiddleware;
