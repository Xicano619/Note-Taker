// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./db/db.json");
const shortid = require("shortid");

// console.log(shortid.generate());

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3006;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// =============================================================
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays notes
app.get("/api/notes", function (req, res) {
  return res.json(db);
});

// Saving notes to DB.
app.post("/api/notes", function (req, res) {
  console.log(req.body);
  var newNote = {
    id: shortid.generate(),
    title: req.body.title,
    text: req.body.text,
  };
  console.log(newNote);
  db.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(db), function (err) {
    if (err) throw err;
    return res.json(db);
  });
});

// Deleting notes
app.delete("/api/notes/:id", function (req, res) {
    console.log(req.params.id);
    var id = req.params.id;
    // Use splice to delete the selected note from the db array
    db.splice(id - 1, 1);
    // Reassign id for each note object
    db.forEach((obj, i) => {
      obj.id = i + 1;
    });
    // Return the remaining notes to the client
    fs.writeFile("./db/db.json", JSON.stringify(db), function () {
      res.json(db);
    });
  });
//     // filter out the note that I dont want anymore
//     // let jsonData = db;

//     // let filterJsonData = jsonData.filter(addNote => addNote.id !== req.params.id);
    
//     deleteNote(req.param.id);
//     // re-write the db.json with new filter array
//     res.json (
//         {addNote: true}
//     ); 
//     // send status to front end, 200. 
//     return res.json(db);
//   });

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
