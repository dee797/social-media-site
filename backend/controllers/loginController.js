require('dotenv').config();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// POST requests
const postLogin = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            return res.json({ message: info.message });
        }
        
        req.login(user, {session: false}, (err) => {
            if (err) return next(err);

            const token = jwt.sign(user, process.env.SECRET, { expiresIn: '8h'});
            // On frontend, if user_id && token then redirect to home path ("/")
            return res.json({user_id: user.user_id, token});
        });
    })(req, res, next);
};

module.exports = {
    postLogin
}