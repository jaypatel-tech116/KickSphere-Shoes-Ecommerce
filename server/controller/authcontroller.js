import logger from '../config/logger.js';
import User from "../model/user-model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const safeCompare = (a, b) => {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};
import { genToken, genToken1 } from "../config/token.js";
import validator from "validator"
import transporter from "../config/nodemailer.js"
import { welcomeEmail, otpEmail } from "../utils/emailTemplates.js"
import dotenv from "dotenv"
dotenv.config()
const hasEmailConfig = () => {
    const emailUser = String(process.env.EMAIL_USER || "").trim();
    const emailPass = String(process.env.EMAIL_PASS || "").replace(/\s+/g, "");
    return Boolean(emailUser && emailPass);
};

const getCookieOptions = (maxAge) => {
    return {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
        maxAge,
        path: "/"
    };
};
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userexist = await User.findOne({ email })
        if (userexist) {
            return res.status(400).json({ message: "User already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "User not valid" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "pass must be grater than 8 " })
        }
        const hashpass = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashpass, accountverify: false })

        return res.status(201).json({ message: "Registration successful. Please verify OTP.", email: user.email })
    } catch (error) {
        logger.error("Registration error:", error);
        return res.status(500).json({ message: "register error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.accountverify === false) {
            return res.status(404).json({ message: "User not verified" })
        }
        const checkpass = await bcrypt.compare(password, user.password)
        if (!checkpass) {
            return res.status(400).json({ message: "password is wrong" })
        }
        const token = await genToken(user._id)
        res.cookie("token", token, getCookieOptions(7 * 24 * 60 * 60 * 1000))

        return res.status(200).json({ message: "login sucessful" })
    } catch (error) {
        logger.error("Login error:", error);
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", getCookieOptions(0))
        return res.status(200).json({ message: "logout successful" })
    } catch (error) {
        return res.status(500).json({ message: "logout error" })
    }
}

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const glogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, picture, email_verified } = ticket.getPayload();

        if (!email_verified) {
            return res.status(403).json({ success: false, message: "Google account email not verified" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name, email, accountverify: true,
                image: picture
            })
        } else if (!user.accountverify) {
            user.accountverify = true;
            await user.save();
        }

        const token = await genToken(user._id)
        res.cookie("token", token, getCookieOptions(7 * 24 * 60 * 60 * 1000))

        return res.status(200).json({ success: true, user })
    } catch (error) {
        logger.error("Google login error:", error);
        return res.status(500).json({ success: false, message: "Google login failed", error: error.message, stack: error.stack })
    }
}

export const Adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && safeCompare(password, process.env.ADMIN_PASS)) {
            const token = await genToken1(email)
            res.cookie("token", token, getCookieOptions(1 * 24 * 60 * 60 * 1000))
            return res.status(200).json(token)
        }
        return res.status(400).json({ message: "Login error for admin" })
    } catch (error) {
        return res.status(500).json({ message: "Login error for admin", error })
    }
}

export const resetotpgenerate = async (req, res) => {
    try {
        const { email } = req.body;
        if (!hasEmailConfig()) {
            return res.status(500).json({ message: "Email service not configured on server" });
        }
        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetotp = otp;
        user.resetexpireat = Date.now() + 5 * 60 * 1000;
        await user.save();
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Reset Your KickSphere Password",
                html: otpEmail(otp, "reset")
            });
        } catch (mailError) {
            logger.error("Reset OTP mail send error:", mailError);
            return res.status(500).json({
                message: "Unable to send reset email. Please check server email config.",
                error: mailError?.message || "Unknown mail error"
            });
        }

        return res.status(200).json({
            message: "OTP sent to your email successfully",
        });
    } catch (error) {
        logger.error("OTP Generate Error:", error);
        return res.status(500).json({
            message: "Fail OTP generate",
        });
    }
};

export const resetotpverify = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || !otp || !newPassword) {
            return res.status(400).json({ message: "Invalid request" });
        }
        if (user.resetotp !== otp) {
            return res.status(400).json({ message: "otp not verify" })
        }
        if (user.resetexpireat < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        const newpass = await bcrypt.hash(newPassword, 10)
        user.resetotp = "";
        user.resetexpireat = 0;
        user.password = newpass;
        await user.save();
        return res.status(200).json({
            message: "reset password successfully"
        })
    } catch (error) {
        logger.error("OTP verification error:", error);
        return res.status(500).json({ message: "OTP verification failed" });
    }
}

export const otpgenerate = async (req, res) => {
    try {
        if (!hasEmailConfig()) {
            return res.status(500).json({ message: "Email service not configured on server" });
        }
        const userID = req.body.email;
        const user = await User.findOne({ email: userID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.otp = otp;
        user.expireat = Date.now() + 5 * 60 * 1000;
        await user.save();

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Verify Your KickSphere Account",
                html: otpEmail(otp, "verification")
            });
        } catch (mailError) {
            logger.error("Register OTP mail send error:", mailError);
            return res.status(500).json({
                message: "Unable to send OTP email. Please check server email config.",
                error: mailError?.message || "Unknown mail error"
            });
        }

        return res.status(200).json({
            message: "OTP sent successfully",
        });
    } catch (error) {
        logger.error("OTP Generate Error:", error);
        return res.status(500).json({
            message: "Fail OTP generate",
        });
    }
};


export const otpverify = async (req, res) => {
    try {
        const { otp } = req.body;
        const userID = req.body.email;

        const user = await User.findOne({ email: userID });

        if (!user || !otp) {
            return res.status(400).json({ message: "Invalid request" });
        }

        if (user.expireat < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (user.otp !== String(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.accountverify = true;
        user.otp = "";
        user.expireat = 0;

        await user.save();

        // Send Welcome Email after successful verification
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Welcome to KickSphere!",
                html: welcomeEmail(user.name)
            });
        } catch (mailErr) {
            logger.error("Welcome mail failed:", mailErr);
        }

        const token = await genToken(user._id);
        res.cookie("token", token, getCookieOptions(7 * 24 * 60 * 60 * 1000));


        return res.status(200).json({
            message: "Verification successful",
            user
        });
    } catch (error) {
        logger.error("Verification error:", error);
        return res.status(500).json({ message: "Verification error" });
    }
};

export const mailhealth = async (req, res) => {
    const hasEmailUser = Boolean(String(process.env.EMAIL_USER || "").trim());
    const hasEmailPass = Boolean(String(process.env.EMAIL_PASS || "").replace(/\s+/g, ""));
    const provider = "smtp-gmail";

    if (!hasEmailUser || !hasEmailPass) {
        return res.status(500).json({
            ok: false,
            message: "Email env not configured",
            provider,
            hasEmailUser,
            hasEmailPass
        });
    }

    try {
        await transporter.verify();
        return res.status(200).json({
            ok: true,
            message: "Email transporter ready",
            provider,
            hasEmailUser,
            hasEmailPass
        });
    } catch (error) {
        logger.error("Mail health verify error:", error);
        return res.status(500).json({
            ok: false,
            message: "Email transporter not ready",
            provider,
            hasEmailUser,
            hasEmailPass,
            error: error?.message || "Unknown email transport error"
        });
    }
};

const isauthenticated = async (req, res) => {

    try {
        const userID = req.userId;
        const user = await User.findById(userID);
        if (user.accountverify === true) {
            return res.status(200).json({ message: "account verification sucessfully" })
        }
        else {
            return res.status(400).json({ message: "account verification not sucessfully" })
        }
    } catch (error) {
        return res.status(400).json({ message: "account verification not sucessfully" })
    }
}