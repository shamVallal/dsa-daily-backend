require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const sendQuestionsEmail = require("./utils/sendQuestionsEmail");
const allQuestions = require("./striverQuestions.json");

function getQuestionsByLevel(level) {
  const filtered = allQuestions.filter(q => q.difficulty === level);
  return filtered.sort(() => 0.5 - Math.random()).slice(0, 2);
}

async function sendEmailTask() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for scheduled email sending");

    const email = "shampvallal7@gmail.com"; // ✅ your actual Gmail address
    const questions = getQuestionsByLevel("Easy");
    console.log("📨 Sending email to:", email, "with questions:", questions.map(q => q.title));

    await sendQuestionsEmail(email, questions);

    console.log(`✅ Email successfully sent to ${email}`);
  } catch (error) {
    console.error("❌ Error during scheduled email task:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📴 MongoDB disconnected after sending email");
  }
}

// Run once immediately for testing
sendEmailTask();

// Schedule to run every day at 9:00 AM
cron.schedule("0 9 * * *", sendEmailTask);
