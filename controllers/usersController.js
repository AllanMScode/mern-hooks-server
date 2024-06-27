const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signup(req, res) {
  try {
    // Get the email and password off the req body
    const emailFromRequestBody = req.body.email;
    const passwordFromRequestBody = req.body.password;

    //   Hash password
    const hashedPassword = bcrypt.hashSync(passwordFromRequestBody, 8);

    // Create a user with the data (in the DB)
    await User.create({
      email: emailFromRequestBody,
      password: hashedPassword,
    });

    // respond with the new created user
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    // Get the email and password off the request body
    // const { email, password } = req.body;
    const emailFromRequestBody = req.body.email;
    const passwordFromRequestBody = req.body.password;

    // Find the user with requested email
    const userRowWithSameEmail = await User.findOne({
      email: emailFromRequestBody,
    }); // find one user where email is equal to email from request body
    if (!userRowWithSameEmail) return res.sendStatus(401); // if user doesn't exist, send 401 (unauthorized)

    // Compare sent in password with found user password hash
    const passwordMatch = bcrypt.compareSync(
      passwordFromRequestBody,
      userRowWithSameEmail.password
    );
    if (!passwordMatch) return res.sendStatus(401); // unauthorised

    // (If everything matches,) Create a jwt token
    const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
    // const expirationTime = Date.now() + 1000 * 10; // 10 seconds

    const token = jwt.sign(
      { sub: userRowWithSameEmail._id, exp: expirationTime }, // first argument is the data we want to encrypt within out token, & the second argument is the secret key which will be used to encrypt it & decrypt it
      process.env.SECRET
    );

    //   Set the cookie
    res.cookie("Authorization", token, {
      expires: new Date(expirationTime),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // in production, it will only work on https
    });

    // Send the jwt token
    //   res.json({ token }); // bad practice (what they show in most videos)
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

function logout(req, res) {
  try {
    // Delete the cookie
    res.clearCookie("Authorization");

    // respond with 200
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function checkAuth(req, res) {
  try {
    // console.log(req.user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
};
