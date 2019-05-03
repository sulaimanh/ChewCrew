//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");



const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
// parse requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// - Create a session middleware with the given options
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

// - We do this in order to use passport. We initialize it here
app.use(passport.initialize());
// - We use passport to also set up our session
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/chewcrewDB", {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

const User = require("./models/User.js");

passport.use(User.createStrategy());

// - This is only necessary for the cookies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// - This is only necessary for the cookies
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// - COMPLETE
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/profile",
    // - We add this because of the Google+ deprecation
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      username: profile.emails[0].value,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      googleId: profile.id
    }, function(err, user) {
      if (!user) {} else {
        return cb(err, user);
      }
    });
  }
));

app.get("/", function(req, res){
  res.render("signin");
});

app.get("/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ],
    prompt: 'select_account'
  })
);
app.get("/auth/google/profile",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  function(req, res) {
    // - Succesful authetication, redirect to secrets
    res.redirect("/profile");
  });


// - LOGOUT - COMPLETE
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

// - LOGIN - COMPLETE
app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile")
      });
    }
  });
});




// const signInRouter = require("./routes/signin");
const crewRouter = require("./routes/crews");
const profileRouter = require("./routes/profile");
const createRouter = require("./routes/create");
const joinRouter = require("./routes/join");
const dishesRouter = require("./routes/dishes");
// app.use("/", signInRouter);
app.use("/crews", crewRouter);
app.use("/create", createRouter);
app.use("/profile", profileRouter);
app.use("/join", joinRouter);
app.use("/dishes", dishesRouter);


// listen on port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
