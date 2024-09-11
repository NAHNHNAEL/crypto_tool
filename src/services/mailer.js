import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  // Setting service send mail
  service: 'gmail',
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.MAIL_PASSWORD
  }
});

async function sendVerificationEmail(userEmail, verificationToken) {
  const verificationUrl = `${process.env.SITE_URL}/user/verify-email?token=${verificationToken}`;
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: userEmail,
    subject: 'Email Verification',
    html: `
    <p>Please verify your email by clicking the button below:</p>
    <p>Password expires in 1 day</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
    <p>${verificationUrl}</p>
  `
};

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

export default sendVerificationEmail;