// node_modules imports
require("dotenv").config();
require("./config/passport");
const path = require("node:path");
const express = require("express");
const cors = require("cors");



// Router / Controller imports
const usersRouter = require("./routes/usersRouter");
const homeRouter = require("./routes/homeRouter");
const searchRouter = require("./routes/searchRouter");
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

app.use("/search", isAuthenticated, searchRouter);



// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    // if statuscode = 400 && error redirect to login page on frontend (invalid token)
    res.status(err.statusCode || 500).json({error: "An error has occurred."});
  });
  
app.all("/*", (req, res, next) => {
  res.status(404).json({error: "404 - Not Found" });
  ;
});



const PORT = process.env.PORT || 3000;
//app.listen(PORT);

module.exports = app;