const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const checkLogin = require("../middleWares/checkLogin");
//Get all the todo
router.get("/", checkLogin, async (req, res) => {
  try {
    console.log(req.username);
    // const newTodo = new Todo(req.body);
    const allTodo = await Todo.find({})
      .populate("user", "name username -_id")
      .select({ _id: 0, __v: 0, date: 0 });
    res.status(200).json({
      status: true,
      resultSet: allTodo,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      status: false,
    });
  }
});

//Get todo by id
router.get("/:id", checkLogin, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    res.status(200).json({
      status: true,
      result: todo,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      status: false,
    });
  }
});

//Post a todo
router.post("/", checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      user: req.userId,
    });

    const todo = await newTodo.save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          todos: todo._id,
        },
      }
    );
    res.status(200).json({
      status: true,
      message: "Todo was inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      status: false,
    });
  }
});

//Get all todo
router.post("/all", checkLogin, async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({
      status: true,
      message: "Todo's were inserted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      status: false,
    });
  }
});

//Update a todo
router.put("/:id", checkLogin, async (req, res) => {
  try {
    const updatedDoc = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: "inactive",
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: true,
      message: "Todo was updated successfully",
      result: updatedDoc,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a server side error", status: false });
  }
});

//Delete a todo
router.delete("/:id", checkLogin, async (req, res) => {
  try {
    const todo = await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      status: true,
      message: "Deleted Successful",
      result: todo,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "There was a server side error", status: false });
  }
});

module.exports = router;
