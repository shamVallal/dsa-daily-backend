const nodemailer = require("nodemailer");

async function sendQuestionsEmail(email, questions) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,  // <-- Change here
        pass: process.env.MAIL_PASS,  // <-- And here
      },
    });

    const htmlBody = `
      <h2>Your Daily DSA Questions 📬</h2>
      <ul>
        ${questions
          .map(
            (q, i) =>
              `<li><strong>Q${i + 1}:</strong> <a href="${q.link}" target="_blank">${q.title}</a></li>`
          )
          .join("")}
      </ul>
      <p>All the best!</p>
    `;

    let mailOptions = {
      from: process.env.MAIL_USER,  // <-- Change here too
      to: email,
      subject: "Your Daily DSA Questions ",
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

module.exports = sendQuestionsEmail;
