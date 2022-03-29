const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.JWT_SECRET];
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    error.message = 'Sign in to continue';
    error.status = 401;
    next(error);
  }
};