const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./datebase");
const Note = require("./notes");
const session = require("express-session");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/full-width"); // Check if the path is correct
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(express.static("public"));
const port = 8080;

// The bottom is just routes and function working together that adds functionatlity//

// Middleware to attach user data to all responses
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Then, define routes or other middleware that use the session
app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = { name: "Kevin", profilePicUrl: "/Shrek.jpeg" };
  }
  res.locals.user = req.session.user;
  next();
});

// Route to update user name
app.post("/update-name", (req, res) => {
  const newName = req.body.username;
  req.session.user.name = newName; // Update the name in the session
  req.session.nameSubmitted = true; // Set a flag indicating the name has been submitted
  res.redirect("/notes"); // Redirect to the homepage or wherever you want
});

app.get("/calendar", (req, res) => {
  res.render("calendar");
});

app.get("/create-note", (req, res) => {
  res.render("createNote");
});

app.get("/notes", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  try {
    const notes = await Note.getNotes(searchTerm);
    res.render("notes", { notes: notes }); // This should point to a view file `notes.ejs` under `views/`
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    const notes = await Note.find(); // Fetch all notes
    if (!note) {
      return res.status(404).send("Note not found");
    }
    res.render("singleNote", { note }); // Pass both the specific note and all notes
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).send("Internal Server Error");
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
