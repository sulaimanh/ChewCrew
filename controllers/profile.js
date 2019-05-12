const User = require("../models/User.js");
const UserDish = require("../models/UserDish.js");
const Crew = require("../models/Crew.js");
const Event = require("../models/Event.js");

let active = 0;

exports.profile = (req, res) => {
  active = -1;
  Event.find({members : req.user._id})
  .then(events => {
    User.findById(req.user.id)
    .then(foundUser => {
          res.render("profile", {
            active : active,
            usersName : foundUser,
            events : events
          });
    }).catch(err => {
      console.log(err);
    });
  }).catch(err => {
    console.log(err);
  });
};

exports.addPicture = (req, res) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.path;
  }

  User.findOneAndUpdate({_id : req.body.userId}, {
    "$set" :{
      image : imagePath
    }
  })
  .then(foundUser => {
    res.redirect("/profile");
  }).catch(err => {
    console.log(err);
  });
}
