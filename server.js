// Load env variables
if (process.env.NODE_ENV != "production") {
  // if the project is deployed for production, the environment variables from .env file will not be used (usually hosting services like heroku, aws, etc have process.env.NODE_ENV set equal to production)
  require("dotenv").config();
}

// Import dependencies
const express = require("express");
const cors = require("cors"); // by default, the server won't allow requests from other domains & our react app is gonna be on a different domain than the server. so we have to setup cors package to allow requests.
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/connectToDb"); // Importing connection file for mongoDB
const notesController = require("./controllers/notesController");

const usersController = require("./controllers/usersController");
const requireAuth = require("./middleware/requireAuth");

// Create an express app
const app = express();
// app.use(cors()); // now our server will accept request from any domain. this is kinda relaxed, normally we'd use domain names & restrict routes, etc.

app.use(
  cors({
    origin: true, // This option instructs the middleware to allow requests from any origin. In a production environment, it's generally recommended to be more specific about allowed origins for security reasons. You might replace true with a specific domain name or a list of allowed domains.
    credentials: true, // This option allows the CORS middleware to include credentials (such as cookies or authorization headers) in requests coming from allowed origins. This is necessary if your application relies on cookies or other mechanisms that require sending credentials across origins.
  })
); // special config since our react app in on a different domain
app.use(cookieParser());

// Configure express app (our server will send & read json, but by default, express can't read json from the request body. We have to configure to do that )
app.use(express.json()); // this will make it read json off the request body

// Connect to database
connectToDb(); // running the function we imported above (to connect to mongoDB)

// Routing
// test route
// anytime someone hits the path '/', it will run that function
app.get("/", (req, res) => {
  res.json({ hello: "world" }); // res.json means it will respond with json
});

// Signup, login & logout
app.post("/signup", usersController.signup);
app.post("/login", usersController.login);
app.get("/logout", usersController.logout);
app.get("/check-auth", requireAuth, usersController.checkAuth); // when someone hits the checkAuth function, it will run the requireAuth function and check if they're logged in & if the token is valid. if it's not valid we will send a 401. If it is valid, we call next & it moves to out checkAuth controller function.

// GET
app.get("/get-all-notes", requireAuth, notesController.fetchNotes);

// GET single note
app.get("/get-a-single-note/:id", requireAuth, notesController.fetchNote); // we want to accept an id from the url (eg: the user will send get-a-single-note/xdfdd (the note id)), so to get the id from the url, we put a colon and the variable we want to assign it to (here, id)

// POST
app.post("/create-note", requireAuth, notesController.createNote);

// PUT
app.put("/update-note/:id", requireAuth, notesController.updateNote);

// DELETE
app.delete("/delete-note/:id", requireAuth, notesController.deleteNote);

// Start our server
app.listen(process.env.PORT);
