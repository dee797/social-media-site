const { Router } = require("express");
const signUpController = require("../controllers/signUpController");
const signUpRouter = Router();


signUpRouter.post("/", signUpController.postSignUp);


module.exports = signUpRouter;