const express = require('express')
const router = express.Router()
const User = require("../models/UserModel")
const authMiddleware = require('../middleware/authMiddleware')
const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { username, phone, dob } = req.body;
        const userId = req.user.id; // from authMiddleware
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, phone, dob },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/profile/upload", authMiddleware, upload.single("profilePic"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const userId = req.user.id
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_profiles",
            resource_type: "image",
        });

        // Update user's profilePic URL in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: result.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePic: result.secure_url,
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.put(
    "/profile/update-password",
    authMiddleware,
    body("oldPassword", "Old password is required").notEmpty(),
    body(
        "newPassword",
        "Password must contain a minimum of 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special symbol."
    ).isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
    }),
    async (req, res) => {
        const userId = req.user.id
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errorMessage: errors.array() });
        }

        try {
            const { oldPassword, newPassword } = req.body;

            // find user
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            // verify old password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch)
                return res.status(401).json({ message: "Old password is incorrect" });

            // hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // update password
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);


module.exports = router;