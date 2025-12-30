const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token =
    (req.body && req.body.token) ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const tokenString = token.startsWith("Bearer ")
      ? token.slice(7).trim()
      : token;

    const decoded = jwt.verify(
      tokenString,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = { authenticate };
