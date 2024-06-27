const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // this makes the field required
    unique: true, // every email in our DB has to be unique
    lowercase: true, // this will convert any email that comes into lowercase
    index: true, // this makes quering by email a lot faster, but it also makes the DB a little bit bigger
  },
  password: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
