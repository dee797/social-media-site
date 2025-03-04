const passport = require("passport");

const isAuthenticated = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, (err, user, info, status) => {
      if (err) {
        if (res.app.locals.currentUser) delete res.app.locals.currentUser;
        if (err.message === "Invalid token.") err.statusCode = 401;
        return next(err);
      }
      if (!user) return res.status(401).json({ authenticated: false});
      next();
    })(req, res, next);
}

module.exports = {
    isAuthenticated
}