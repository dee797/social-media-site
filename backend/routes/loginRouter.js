const { Router } = require("express");
const loginController = require("../controllers/loginController");
const loginRouter = Router();

// if already logged in return json "already logged in as [user], button to return home"
loginRouter.post("/", loginController.postLogin);


module.exports = loginRouter;