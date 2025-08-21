module.exports = function (req, res, next) {
  if (req.user) return next();
    req.session.redirectTo = req.originalUrl;
  res.redirect('/auth/sign-in');
};