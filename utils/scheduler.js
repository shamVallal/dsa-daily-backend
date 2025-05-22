const cron = require("node-cron");
const User = require("../models/User");
const Question = require("../models/Question");
const sendMail = require("./mailer");

cron.schedule("0 9 * * *", async () => {
  const users = await User.find({});
  for (let user of users) {
    const questions = await Question.find({ difficulty: user.skillLevel }).limit(2);
    
    const htmlContent = `
      <h2>Your DSA Questions for Today</h2>
      <ul>
        ${questions.map(q => `<li><a href="${q.url}">${q.title}</a> - ${q.description}</li>`).join("")}
      </ul>
    `;
    
    await sendMail(user.email, "Your Daily DSA Questions", htmlContent);
    user.lastSentDate = new Date();
    user.streak += 1;
    await user.save();
  }
});


