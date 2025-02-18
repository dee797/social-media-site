require('dotenv').config();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// GET requests
const getLogin = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
};


// POST requests
const postLogin = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res.json({ message: info.message });
        }
        
        req.login(user, {session: false}, (err) => {
            if (err) return next(err);

            const token = jwt.sign(user, process.env.SECRET, { expiresIn: '30m'});
            // On frontend, if user && token then redirect to home path ("/")
            return res.json({user, token});
        });
    })(req, res, next);
};

module.exports = {
    getLogin,
    postLogin
}