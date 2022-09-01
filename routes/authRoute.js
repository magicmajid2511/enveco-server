const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/authModel");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/login", isLoggedIn, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    bcrypt.compare(password, user.password).then((isSamePassword) => {
      if (!isSamePassword) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }
      // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
      res.send(user);
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/register", isLoggedOut, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.send("User created successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
