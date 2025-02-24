const userDB = require('../db/userCRUD');
const postDB = require('../db/postCRUD');
const asyncHandler = require('express-async-handler');

const getHome = asyncHandler(async (req, res) => {
    const users = await userDB.get10Users();
    const posts = await postDB.get10Posts();

    res.json({users, posts});
});

module.exports = {getHome};