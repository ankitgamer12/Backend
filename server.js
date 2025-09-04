const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

//cors enable
app.use(cors());

//backend
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");
const airoutes = require("./routes/ai");

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", airoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
