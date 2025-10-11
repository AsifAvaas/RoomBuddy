const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const User = require("../models/UserModel")
const Token = require("../models/TokenModel")
const { body, validationResult } = require('express-validator');
const crypto = require("crypto");
const backend_url = process.env.Backend_url
const sendEmail = require("../utils/sendMail")
const isProduction = process.env.NODE_ENV === 'production'
const verifyEmailTemplate = require('../utils/emailtemplates/verifyEmailTemplate');
const generateTokens = require('../utils/generateTokens');
const resetPasswordTemplate = require('../utils/emailtemplates/ResetPasswordTemplate');
const frontend = process.env.Frontend_url
const jwtSecret = process.env.JWT_SECRET



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

            const token = new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex')
            })
            if (!token) {
                return res.status(404).json({ success: false, message: "Couldn't create Token" })
            }
            console.log("Token created")
            await token.save()


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
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
        const isAdmin = user.isAdmin

        res.status(200).json({ success: true, message: "Logged in successfully", isAdmin });
    } catch (error) {
        //console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
})


//Google Oauth Login
router.post('/google/login', async (req, res) => {
    const { name, email, profilePic } = req.body
    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            user = await new User({
                username: name,
                email: email,
                password: "",
                profilePic: profilePic,
                isVerified: true,
                isAdmin: false

            })
        }
        user.save()
        const { accessToken, refreshToken } = generateTokens(user._id)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });
        const isAdmin = user.isAdmin

        res.status(200).json({ success: true, message: "Logged in successfully", isAdmin });

    } catch (error) {
        console.log(error)
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
        return res.status(500).json({ success: false, message: 'Loggiong out unsuccessful' });
    }

})

// Email varification route
router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user) return res.status(400).json({ message: "Invalid Link 1" })

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        })
        if (!token)
            return res.status(400).json({ message: "Invalid Link 2" })

        await user.updateOne({ _id: user._id, isVerified: true })
        await Token.deleteOne({ _id: token._id });
        res.redirect(`${frontend}/login`)


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Sevrver Error" })
    }
})

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body
    try {
        console.log(email)
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ success: false, error: "User does not exist" })
        }
        const secret = jwtSecret + user.password
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "10m" })

        const link = `${backend_url}/api/reset-password/${user._id}/${token}`

        await sendEmail(
            user.email,
            "Password Reset Request",
            resetPasswordTemplate(link)
        );
        res.json({ success: true });

    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.get('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params
    const user = await User.findById(id)
    if (!user) {
        return res.json({ success: false, error: "User does not exist" })
    }
    const secret = jwtSecret + user.password
    try {
        const verify = jwt.verify(token, secret)
        if (verify) {
            const email = user.email;

            res.redirect(`${frontend}/resetPassword?id=${id}&email=${email}`);
        } else {
            return res.json({ success: false, error: "Invalid token" });
        }
    } catch (error) {
        return res.json({ success: false, error: "User does not exist" })
    }

})

// Reset password update route
router.put('/password/reset', body('password', 'Password must contain minimum of 8 letters, including 1 uppuercase, 1 lowercase, 1 number and 1 spacial symbol.').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
}), async (req, res) => {

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.json({ errorMessage: result.array() });
    }

    const { id, password } = req.body
    const user = await User.findById(id)
    if (!user) {
        return res.json({ error: "User does not exist" })
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const securepassword = await bcrypt.hash(password, salt);

        user.password = securepassword
        await user.save()
        return res.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        return res.json({ error: 'An error occurred while updating the password' })
    }

})


module.exports = router