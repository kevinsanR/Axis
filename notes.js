const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  contents: String,
});

// Static method to get notes with optional search term
noteSchema.statics.getNotes = function(searchTerm) {
  const query = searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {};
  return this.find(query);
};

// Static method to get a single note by ID
noteSchema.statics.getNote = function(id) {
  return this.findById(id);
};

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;