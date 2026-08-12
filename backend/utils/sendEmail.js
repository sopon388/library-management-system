const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"LibraCore Library" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;