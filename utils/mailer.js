const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = (to, subject, html) => {
  return transporter.sendMail({
    from: `"DSA Daily" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
