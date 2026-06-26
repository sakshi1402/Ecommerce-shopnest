const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        console.log("USER:", process.env.EMAIL_USER);
        console.log("PASS:", process.env.EMAIL_PASS);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailoptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text

        }
        await transporter.sendMail(mailoptions)
    } catch (error) {
        console.log("Error in Sending Email", error)
    }
}
module.exports = sendEmail