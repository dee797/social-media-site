// node_modules imports
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const passport = require("passport");


// Router / Controller imports
const usersRouter = require("./routes/usersRouter");
const homeRouter = require("./routes/homeRouter");


// Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));


// Check if there is an authenitcated user on all incoming requests
/*
app.use((req, res, next) => {
  passport.authenticate("jwt", {session: false});

  if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
      next();
  } else {
      res.json({ authenticated: false });
  }
});
*/

// Endpoint URIs
app.use("/users", usersRouter); 

// gets data to display on home page 
app.use("/home", homeRouter);

/*
// include search/?handle=[something] ; search by itself should display "search for a user to get started"
app.use("search", searchRouter);
app.use("notifications", notificationsRouter)

*/

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({error: "Internal server error"});
  });
  
app.all("/*", (req, res, next) => {
  res.status(404).json({error: "404 - Not Found" });
  ;
});



const PORT = process.env.PORT || 3000;
//app.listen(PORT);

module.exports = app;