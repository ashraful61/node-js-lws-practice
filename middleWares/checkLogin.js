const jwt = require("jsonwebtoken");

const checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { username, userId } = decoded;
    req.username = username;
    req.userId = userId;
    next();
  } catch(err) {
    console.log(err)
    next("Authentication error!");
  }
};

module.exports = checkLogin;
