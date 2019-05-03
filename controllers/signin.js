const User = require("../models/User.js");

exports.signIn = (req, res) => {
  res.render("signin");
};

// 
// exports.login = (req, res) => {
//   const user = new User({
//     username : req.body.username,
//     password : req.body.password
//   });
//
//   req.login(user)
//   .then()
// }
//
// exports.logout = (req, res) => {
//   req.logout();
//   res.redirect("/");
// };
