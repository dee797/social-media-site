const passport = require("passport");

const isAuthenticated = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, (err, user, info, status) => {
      if (err) {
        if (res.app.locals.currentUser) delete res.app.locals.currentUser;
        if (err.message === "Invalid token.") err.statusCode = 400;
        return next(err);
      }
      if (!user) return res.json({ authenticated: false});
      next();
    })(req, res, next);
}

module.exports = {
    isAuthenticated
}