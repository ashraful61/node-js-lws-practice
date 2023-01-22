const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler")

const port = process.env.PORT || 5000;

// express app initialization
const app = express();
require('dotenv').config();
app.use(express.json());

// database connection with mongoose
mongoose.set('strictQuery', false);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustertestashraf.z94m9ys.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    dbName: 'TodoDb',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// Application Routes
//Todo Route
app.use("/todo", todoHandler);

//User Route
app.use("/user", userHandler)

// default error handler
const errorHandler =  (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`app listening at port: ${port}`);
});
