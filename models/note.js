// the model will define how the database will look

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  // mongoose.Schema creates a new schema(database) & the object provides a blueprint of the schema
  // notesSchema is the variable which stores the value of mongoose.Schema
  title: String,
  body: String,
});

const Note = mongoose.model("Note", noteSchema); // The first argument, "Note", is the name you want to give to the model. This name will be used to refer to your notes in your application. The second argument, noteSchema, is the schema you defined earlier. The model will use this schema to understand the structure of your data.
// the name of the table / collection will probably be 'notes'

module.exports = Note; // This line makes the Note model available to other parts of your application.
