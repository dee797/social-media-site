const passport = require("passport");

const isAuthenticated = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, (err, user, info, status) => {
      if (err) return next(err);
      if (!user) return res.json({ authenticated: false});
      next();
    })(req, res, next);
}

module.exports = {
    isAuthenticated
}