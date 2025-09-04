// checks Authorization: Bearer <token>

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const h = req.headers.authorization;

  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  const token = h.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
