const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Scheduler
require("./utils/scheduler");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const dailyTask = require("./cron/dailyTask");
dailyTask.start();
