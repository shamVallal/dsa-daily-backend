const cron = require("node-cron");
const User = require("../models/User");
const sendQuestionsEmail = require("../utils/sendQuestionsEmail");

const questionsDB = {
  Easy: [
    "Reverse an array",
    "Check palindrome string",
    "Find min/max in array"
  ],
  Medium: [
    "Longest Substring Without Repeating Characters",
    "2 Sum Problem",
    "Detect cycle in a linked list"
  ],
  Hard: [
    "Median of two sorted arrays",
    "Implement LRU cache",
    "Word Ladder problem"
  ]
};

function getQuestionsByLevel(level) {
  const allQs = questionsDB[level];
  const selected = allQs.sort(() => 0.5 - Math.random()).slice(0, 2);
  return selected;
}

const dailyTask = cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily DSA mail job");

  const users = await User.find();
  for (let user of users) {
    const questions = getQuestionsByLevel(user.level || "Easy");
    await sendQuestionsEmail(user.email, questions);

    // Update streak and upgrade level if needed
    user.streak = (user.streak || 0) + 1;

    if (user.streak === 5 && user.level === "Easy") user.level = "Medium";
    if (user.streak === 10 && user.level === "Medium") user.level = "Hard";

    await user.save();
  }

  console.log("✅ Daily emails sent!");
});

module.exports = dailyTask;
