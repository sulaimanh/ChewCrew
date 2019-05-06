const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim : true,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  },
  time: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
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


module.exports = mongoose.model("Event", eventSchema);
