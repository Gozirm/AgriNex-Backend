import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Configure the transporter for sending emails
let transporter;
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("Transporter configured successfully.");
} catch (error) {
  console.error("Error configuring transporter:", error);
}

// Controller function for subscribing
const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Send a welcome email to the subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                <h2 style="color: #2e7d32; margin-bottom: 20px;">🎉 Welcome to Our Platform!</h2>
                
                <p style="font-size: 16px; color: #333;">Hi there!</p>
                <p style="font-size: 16px; color: #333;">Thank you for subscribing to our platform. We're excited to have you on board!</p>
                
                <p style="font-size: 14px; color: #888; margin-top: 30px;">If you have any questions, feel free to reach out to us at any time.</p>
                </div>
            </div>
            `,
    });

    // Notify the admin about the new subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: [process.env.EMAIL_USER, "adedayoabdulqadri@gmail.com"],
      subject: "New Subscriber Alert",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
                <h2 style="color: #2e7d32; margin-bottom: 20px;">📩 New Subscriber Alert</h2>
                
                <p style="font-size: 16px; color: #333;"><strong style="color: #2e7d32;">Email:</strong> ${email}</p>
                
                <p style="font-size: 14px; color: #888; margin-top: 30px;">This notification was sent to inform you about a new subscription on your platform.</p>
            </div>
            </div>
            `,
    });

    res
      .status(200)
      .json({ message: "Subscription successful. Welcome email sent!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send emails. Please try again later." });
  }
};

export default subscribe;
