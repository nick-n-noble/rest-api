const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const { TOKEN_KEY } = process.env;

verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  } else if (! (await User.findOne({ token })) ) {
    return res.status(401).send("Invalid Token");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
