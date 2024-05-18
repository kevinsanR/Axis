const express = require("express");
const app = express();
const connectDB = require("./datebase");
const note = require("./notes")
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
connectDB();



// The bottom is just routes and function working together that adds functionatlity//
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/notes", (req, res) => {
  const searchTerm = req.query.searchTerm;
  const notes = notes.getNotes(searchTerm);
  res.render("notes.ejs", {
    notes,
  });
});

app.get("/notes/:id", (req, res) => {
  const id = +req.params.id;
  const note = note.getNote(id);
  if (!note) {
    res.status(404).render("note404.ejs");
    return;
  }

  res.render("singleNote.ejs", {
    note,
  });
});

app.get("/createNote", (req, res) => {
  res.render("./createNote.ejs");
});

app.post('/notes', async (req, res) => {
  try {
    const { title, contents } = req.body;
    const newNote = new note({ title, contents });
    await newNote.save();
    res.status(201).send('Note created successfully');
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/notes/:id/delete", (req, res) => {
  const id = +req.params.id;
  note.deleteNote(id);
  res.redirect("/notes");
});

app.use(express.static("public"));

const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
