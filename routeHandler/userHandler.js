const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
// require("dotenv").config();

//User sign up api
router.post("/signup", async (req, res) => {
  try {
    const hansPassWord = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hansPassWord,
    });
    await newUser.save();
    res.status(200).json({
      status: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Signup Failed",
      status: false,
    });
  }
});

//User sign in api
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const hansPassWord = await bcrypt.hash(req.body.password, 10);
    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        //Generate jwt token
        const token = jwt.sign(
          { username: user.username, userId: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          message: "Login Successful!",
          status: true,
          access_token: token,
        });
      } else {
        res.status(401).json({
          error: "Authentication failed!",
          status: true,
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed!",
        status: true,
      });
    }
  } catch (err) {
    res.status(401).json({
      error: "Authentication failed!",
      status: true,
    });
  }
});

//Get all users

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).populate("todos");
    res.status(200).json({
      status: true,
      resultSet: users,
    });
  } catch (err) {
    res.status(401).json({
      error: "There was an error on server side",
      status: false,
    });
  }
});
module.exports = router;
