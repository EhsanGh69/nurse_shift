const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendActivationEmail = async (to, code, subject) => {
    try {
         await transporter.sendMail({
           from: `"Your App" <${process.env.GMAIL_EMAIL}>`,
           to,
           subject,
           text: `کد فعال‌سازی شما: ${code}\nاین کد تا 10 دقیقه معتبر است.`,
           html: `<p>کد فعال‌سازی شما: <strong>${code}</strong></p><p>این کد تا 10 دقیقه معتبر است.</p>`
         });
       } catch (error) {
         throw error;
       }
}

module.exports = {
    sendActivationEmail
}