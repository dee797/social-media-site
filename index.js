// node_modules imports
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const cors = require("cors");


// Router / Controller imports




// Configurations
const app = express();
app.use(express.json());
app.use(cors());
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
});


// Routing
app.use("/signup", signUpRouter);
app.use("/login", loginRouter);

// include profile/edit, profile/settings, profile/posts, profile/replies profile/:id for another user's profile
app.use("/profile", isAuthenticated, profileRouter); 
// include post/:id, post/new (to create a post)
app.use("/post", isAuthenticated);
// include search/?handle=[something] ; search by itself should display "try searching to get started"
app.use("search", isAuthenticated)
app.use("/logout", isAuthenticated);
app.use("/", isAuthenticated, indexRouter);



// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message || "Internal server error");
  });
  
  app.all("/*", (req, res, next) => {
    res.status(404).send("404 - Not found");
    ;
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT);