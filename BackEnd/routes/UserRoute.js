const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const User = require("../models/UserModel")
const Token = require("../models/TokenModel")
const { body, validationResult } = require('express-validator');
const crypto = require("crypto");
const backend_url = process.env.Backend_url
const sendEmail = require("../utils/sendMail")
const isProduction = process.env.NODE_ENV === 'production'
const verifyEmailTemplate = require('../utils/emailtemplates/verifyEmailTemplate');
const generateTokens = require('../utils/generateTokens');





router.post('/register', body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1,
    }), async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(401).json({ errorMessage: result.array() })
        }


        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.json({ error: "Email ID already exists" })
            }

            const salt = await bcrypt.genSalt(10)
            const securepassword = await bcrypt.hash(req.body.password, salt)

            user = new User({
                username: req.body.username,
                email: req.body.email,
                password: securepassword,
                isAdmin: req.body.isAdmin
            })

            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            }).save()
            const url = `${backend_url}/api/${user._id}/verify/${token.token}`


            await sendEmail(
                user.email,
                "Verify Your Email Address",
                verifyEmailTemplate(user.username, url)
            );
            user.save();
            res.status(200).json({ success: true, message: "An Email has been send to your account. Please verify." });


        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, error: error.message });

        }

    })


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User is not registered" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Incorrect Password" });
        }

        if (!user.isVerified) {
            console.log("user is not verified")
            let token = await Token.findOne({ userId: user._id })
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
                const url = `${backend_url}/api/${user._id}/verify/${token.token}`
                await sendEmail(user.email, "Verify Your Email Address",
                    verifyEmailTemplate(user.username, url))


            }
            return res.status(200).json({ success: true, message: "An Email has been send to your account. Please verify." })
        }


        const { accessToken, refreshToken } = generateTokens(user._id)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: "Logged in successfully" });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
})


router.post('/logout', async (req, res) => {
    try {
        res.cookie('accessToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });
        res.cookie('refreshToken', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });

        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.status(200).json({ success: false, message: 'Loggiong out unsuccessful' });
    }

})


module.exports = router