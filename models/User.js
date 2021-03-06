const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  dishId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDish",
    required: false
  }],
  crewId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crew",
    required: false
  }],
  image: {
    type: String,
    required: false
  }
  // image : ,

  // userEvents : [userEvents],
  // crews : [crews]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
