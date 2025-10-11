
const User = require('../models/UserModel');

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.isAdmin || !user.isApprovedAdmin) {
            return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while verifying admin role' });
    }
};

module.exports = adminMiddleware;
