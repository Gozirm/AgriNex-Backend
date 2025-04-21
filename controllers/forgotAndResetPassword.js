import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import SignUp from "../models/signUp.js";

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res
                .status(400)
                .json({ success: false, errMsg: "Input field cannot be empty" });
        }

        const user = await SignUp.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, errMsg: "Email not found" });
        }

        const resetToken = CryptoJS.lib.WordArray.random(20).toString();
        user.resetPasswordToken = CryptoJS.SHA256(resetToken).toString();
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.username},</p>
                <p>You requested to reset your password. Click the button below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ success: false, errMsg: error.message });
    }
};

export const resetPassword = async (req, res) => {
        const resetPasswordToken = CryptoJS.SHA256(req.params.resetToken).toString();
    
        try {
            const user = await SignUp.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() },
            });
    
            if (!user) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid or expired reset token." });
            }
    
            user.password = req.body.password;
    
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
    
            await user.save();
    
            res
                .status(201)
                .json({ success: true, message: "Password reset successful." });
        } catch (error) {
            console.error("Error in resetPassword:", error);
            res.status(500).json({ success: false, errMsg: error.message });
        }
    };
