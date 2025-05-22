const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const sendQuestionsEmail = require("./utils/sendQuestionsEmail");

dotenv.config();

const allQuestions = require("./striverQuestions.json");

function getQuestionsByLevel(level, alreadySentTitles = []) {
  const filtered = allQuestions.filter(
    (q) => q.difficulty === level && !alreadySentTitles.includes(q.title)
  );
  return filtered.sort(() => 0.5 - Math.random()).slice(0, 2);
}

const start = async () => {
  console.log("Starting script...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Get your user from DB (or for testing, you can hardcode an email)
  const myEmail = "shampvallal7@gmail.com";

  // Find user in DB to get already sent questions (for now, you can skip or implement later)
  const user = await User.findOne({ email: myEmail });

  // If you want, you can get their sent question titles like this:
  const alreadySent = user?.sentQuestions?.map((q) => q.title) || [];

  // Pick questions not already sent
  const questions = getQuestionsByLevel(user?.level || "Easy", alreadySent);

  console.log("Sending email to:", myEmail);
  console.log("Selected questions:", questions);

  // Send the email
  await sendQuestionsEmail(myEmail, questions);

  // Save sent questions to user to avoid repeats in future
  if (user) {
    user.sentQuestions = [...(user.sentQuestions || []), ...questions];
    await user.save();
  }

  console.log(`✅ Sent email to ${myEmail}`);

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

start().catch((err) => {
  console.error("Error in script:", err);
});
