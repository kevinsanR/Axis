const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/notesrs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;




let currentID = 3;

function getNotes(searchTerm) {
  if (!searchTerm) {
    return notes;
  }
  return notes.filter(
    (note) =>
      note.title.includes(searchTerm) || note.contents.includes(searchTerm)
  );
}
exports.getNotes = getNotes;
function getNote(id) {
  return notes.find((note) => note.id === id);
}
exports.getNote = getNote;

function addNote(note) {
  notes.push({
    ...note,
    id: currentID,
    timestamp: Date.now(),
  });
  currentID++;
}
exports.addNote = addNote;

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
}
exports.deleteNote = deleteNote;
