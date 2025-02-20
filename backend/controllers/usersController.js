require('dotenv').config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../db/userCRUD");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");


// Sanitization / Validation

const validate = [
  body("username")
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage(`Username must be between 8 and 50 characters.`)
    .custom(async username => {
      const user = await db.getUserByHandle({handle: username});
      if (user) { 
        throw new Error("Username already in use.");
      }
    }),

  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1, 
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false
    })
    .withMessage(`Password does not meet the requirements.`),

  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords do not match.`)
];


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



const postNewUser = [
    validate,

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          validationErrors: errors.mapped()
        });
      }
      next();
    },

    asyncHandler(async (req, res) => {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.createUser({
            name: req.body.name,
            handle: req.body.username, 
            password: hashedPassword,
            bio: '',
            profile_pic_url: '',
            banner_pic_url: '',
            date_joined: new Date()
        });
        
        res.json({signupSuccess: true});
    })
];
  



module.exports = { 
    postNewUser,
    postLogin
}