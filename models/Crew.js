const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    trim : true,
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
  image: {
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
  }],
  events : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: false
  }],
  messages : [{
    title : { type : String , required : false},
    content : { type : String , required : false }
  }]

  // membersName : [{type : String, required : true}]
  // Image : ,
  // events : [events],
  // members : [members]
});



crewSchema.index({
  name: "text"
});


module.exports = mongoose.model("Crew", crewSchema);
