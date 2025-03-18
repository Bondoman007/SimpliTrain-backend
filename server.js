const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");
const authRouter = require("./routes/auth");
const app = express();
const cookieParser = require("cookie-parser");
dotenv.config();
app.use(cookieParser());
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5000", // Update to match your frontend
    credentials: true,
  })
);
app.use("/api", authRouter);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
