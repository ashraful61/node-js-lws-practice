const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = todoSchema;