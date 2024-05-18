const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  id: Number,
  title: String,
  timestamp: {
    type: Date,
    default:Date.now,
  },
  contents: String,
});

module.exports = mongoose.model("note", noteSchema);
