const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/index");
const bookRouter = require("./routes/book");
const authorRouter = require("./routes/author");
const genreRouter = require("./routes/genre");
const usersRouter = require("./routes/users");

const app = express();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", indexRouter);
app.use("/book", bookRouter);
app.use("/author", authorRouter);
app.use("/genre", genreRouter);
app.use("/user", usersRouter);

app.use((req, res, next) => {
  res.status(404);
  res.json({ message: "not found :-(" });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500);
  res.json({ message: "unexpected error :-((((" });
});

module.exports = app;
