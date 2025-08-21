const User = require('../models/user');

module.exports = async function (req, res, next) {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
      req.user = user;        
    } catch (err) {
      console.log('Error finding user from session:', err);
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
};