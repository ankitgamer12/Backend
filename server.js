const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

//cors enable
app.use(cors());

//example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
