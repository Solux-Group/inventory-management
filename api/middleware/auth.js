const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      status: 403,
      message: "Token authorization is required",
      error: true,
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.headers["x-access-token"] = decoded;
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message:
        error.name === "TokenExpiredError" ? "Token expired" : error.message,
      error: true,
    });
  }

  return next();
};
