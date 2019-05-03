const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  imagePath: {
    type: String,
    required: false
  },
  creatorName: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }]

  // membersName : [{type : String, required : true}]
  // Image : ,
  // events : [events],
  // members : [members]
});

module.exports = mongoose.model("Crew", crewSchema);