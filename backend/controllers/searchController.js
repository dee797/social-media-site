const asyncHandler = require("express-async-handler");
const { query } = require("express-validator");
const userDB = require("../db/userCRUD");
const validationController = require("../controllers/validationController");


const getMatchingUsers = [
    query("handle")
    .trim()
    .isLength({max:255})
    .withMessage("Search query cannot be more than 255 characters"),

    validationController,

    asyncHandler(async (req, res) => {
        const matchingUsers = await userDB.getMatchingUsers(req.query.handle);
        res.json(matchingUsers);
    })
];

module.exports = {
    getMatchingUsers
}