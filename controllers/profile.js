const User = require("../models/User.js");
const UserDish = require("../models/UserDish.js");
const Crew = require("../models/Crew.js");
const Event = require("../models/Event.js");

let active = 0;

exports.profile = (req, res) => {
  active = -1;
  User.findById(req.user.id)
  .then(foundUser => {
        res.render("profile", {
          active : active,
          usersName : foundUser
        });
  });
};
