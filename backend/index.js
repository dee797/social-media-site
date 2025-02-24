// node_modules imports
require("dotenv").config();
require("./config/passport");
const path = require("node:path");
const express = require("express");
const cors = require("cors");


// Router / Controller imports
const usersRouter = require("./routes/usersRouter");
const homeRouter = require("./routes/homeRouter");
const { isAuthenticated } = require("./controllers/authicateController");


// Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200
}));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

/** 
 * Prevent web pages from being cached in browser, 
 * as caching causes issues with the login system 
 * if user uses the back/forward buttons
 */ 

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  next();
})





// Endpoint URIs
app.use("/users", usersRouter); 

// gets data to display on home page 
app.use("/home", isAuthenticated, homeRouter);

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