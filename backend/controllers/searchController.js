const asyncHandler = require("express-async-handler");
const { query, validationResult } = require("express-validator");
const userDB = require("../db/userCRUD");


const getMatchingUsers = [
    query("handle")
    .trim()
    .isLength({max:255})
    .withMessage("Search query cannot be more than 255 characters"),

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
        const matchingUsers = await userDB.getMatchingUsers(req.query.handle);
        res.json(matchingUsers);
    })
];

module.exports = {
    getMatchingUsers
}