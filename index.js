// node_modules imports
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const passport = require("passport");


// Router / Controller imports
const loginRouter = require("./backend/routes/loginRouter");
const signUpRouter = require("./backend/routes/signUpRouter");


// Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));


// Endpoint URIs

// On frontend: fetch isAuthenticated on every page
app.get("/isAuthenticated", (req, res) => {
    passport.authenticate("jwt", {session: false})

    if (req.isAuthenticated()) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter); 
// include search/?handle=[something] ; search by itself should display "search for a user to get started"
app.use("search", searchRouter);

app.use("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});



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
app.listen(PORT);