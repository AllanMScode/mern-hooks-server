const Note = require("../models/note"); // importing note model (the blueprint)

const fetchNotes = async (req, res) => {
  try {
    // Find the notes
    const listOfAllNotes = await Note.find({ user: req.user._id });

    // Respond with them
    res.json({ notes: listOfAllNotes });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const fetchNote = async (req, res) => {
  try {
    // Get the id off the url
    const noteIdFromTheUrl = req.params.id;

    // Find the note using that id
    const noteFromTheDb = await Note.findOne({
      _id: noteIdFromTheUrl,
      user: req.user._id,
    });

    // Respond with the note
    res.json({ note: noteFromTheDb });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// POST - Create a new note
const createNote = async (req, res) => {
  try {
    // Get the sent in data off request body
    const titleFromRequestBody = req.body.title;
    const bodyFromRequestBody = req.body.body;

    // Create a note with it (take the values from the request body / frontend and insert in the database)
    const ourCreatedNote = await Note.create({
      title: titleFromRequestBody,
      body: bodyFromRequestBody,
      user: req.user._id,
    });

    // respond with the new note (this will be our response in postman / developer tools)
    res.json({ note: ourCreatedNote });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const updateNote = async (req, res) => {
  try {
    // Get the id off the url
    const noteIdFromTheUrl = req.params.id;

    // Get the data off the req body
    const titleFromRequestBody = req.body.title;
    const bodyFromRequestBody = req.body.body;

    // Find and update the record
    await Note.findOneAndUpdate(
      { _id: noteIdFromTheUrl, user: req.user._id },
      {
        title: titleFromRequestBody,
        body: bodyFromRequestBody,
      }
    );

    //   Find updated note (using it's id)
    const updatedNote = await Note.findById(noteIdFromTheUrl);

    // Respond with the updated note (after finding it)
    res.json({ note: updatedNote });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const deleteNote = async (req, res) => {
  try {
    // get id off the url
    const noteIdFromTheUrl = req.params.id;

    // Delete the record
    await Note.deleteOne({ _id: noteIdFromTheUrl, user: req.user._id });

    // Respond with a message (eg: note deleted)
    res.json({ success: "Record deleted" });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// when we use module.exports, we can only export one thing (here, one function), but we need to export 5 functions. So in order to export all of them, we export an object that contains all the stuff we want to export.
module.exports = {
  //   fetchNotes: fetchNotes,
  //   fetchNote: fetchNote,
  //   createNote: createNote,
  //   updateNote: updateNote,
  //   deleteNote: deleteNote,
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
};
