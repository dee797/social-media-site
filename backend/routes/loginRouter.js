const { Router } = require("express");
const loginController = require("../controllers/loginController");
const loginRouter = Router();

// if already logged in return json "already logged in as [user], button to return home"
loginRouter.get("/", loginController.getLogin);
loginRouter.post("/", loginController.postLogin);


module.exports = loginRouter;