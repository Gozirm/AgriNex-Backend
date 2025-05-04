import nodemailer from "nodemailer";
import ContactUs from "../models/contactUs.js";

const submitContactForm = async (req, res) => {
    try {
        const { name, email, message, phoneNumber } = req.body;

        if (!name ||  !phoneNumber || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const contact = new ContactUs({ name, email, message, phoneNumber });
        await contact.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [process.env.EMAIL_USER, "adedayoabdulqadri@gmail.com"],
            subject: "New Contact Us Form Submission",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                    <h2 style="color: #2e7d32; margin-bottom: 20px;">📩 New Contact Us Form Submission</h2>
                    
                    <p style="font-size: 16px; color: #333;"><strong style="color: #2e7d32;">Name:</strong> ${name} </p>
                    <p style="font-size: 16px; color: #333;"><strong style="color: #2e7d32;">Email:</strong> ${email}</p>
                    
                    <p style="font-size: 16px; color: #333;"><strong style="color: #2e7d32;">Message:</strong></p>
                    <blockquote style="border-left: 4px solid #2e7d32; padding-left: 15px; margin: 10px 0; color: #555; font-style: italic;">
                        ${message}
                    </blockquote>
                    
                    <p style="font-size: 14px; color: #888; margin-top: 30px;">This message was sent from the contact form on your website.</p>
                </div>
            </div>
        `
        };

        await transporter.sendMail(mailOptions);

        res
            .status(201)
            .json({ message: "Your message has been submitted successfully." });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res
            .status(500)
            .json({ error: "An error occurred while submitting your message." });
    }
};

export default {
    submitContactForm,
};
