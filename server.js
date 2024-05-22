const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./datebase");
const Note = require("./notes");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/full-width"); // Check if the path is correct
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(express.static("public"));
const port = 8080;

// The bottom is just routes and function working together that adds functionatlity//




app.get("/create-note",  (req, res) => {
  res.render("createNote");
});

app.get("/notes",  async (req, res) => {
  const searchTerm = req.query.searchTerm;
  try {
    const notes = await Note.getNotes(searchTerm);
    res.render("notes", { notes }); // This should point to a view file `notes.ejs` under `views/`
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/notes/:id', async (req, res) => {
  try {
      const note = await Note.findById(req.params.id);
      const notes = await Note.find(); // Fetch all notes
      if (!note) {
          return res.status(404).send('Note not found');
      }
      res.render('noteDetail', { note });  // Pass both the specific note and all notes
  } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).send('Internal Server Error');
  }
});

// This is the route that creates a new note//

app.post("/notes", async (req, res) => {
  const { title, contents } = req.body;
  try {
    const newNote = new Note({
      title,
      contents,
    });
    await newNote.save();
    res.redirect("/notes");
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/notes/:id/delete", async (req, res) => {
  const id = req.params.id;
  try {
    await Note.findByIdAndDelete(id);
    res.redirect("/notes");
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
