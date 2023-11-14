const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `7afiz-shop App <sayedafiz6@gmail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.text
  });
};

module.exports = sendEmail;
