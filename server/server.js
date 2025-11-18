const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5173;

// conectar MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB ✅");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB ❌", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
