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





// Get all notes or filter them by searchTerm
exports.getNotes = async (searchTerm) => {
  if (!searchTerm) {
    return Note.find();
  }
  return Note.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { contents: { $regex: searchTerm, $options: 'i' } }
    ]
  });
};

// Get a single note by ID
exports.getNote = async (id) => {
  return Note.findById(id);
};

// Add a new note
exports.addNote = async (note) => {
  const newNote = new Note({
    ...note,
    timestamp: new Date()
  });
  return newNote.save();
};

// Delete a note by ID
exports.deleteNote = async (id) => {
  return Note.findByIdAndDelete(id);
};
