const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");
const authorsRouter = require("./routes/authors");
const genresRouter = require("./routes/genres");
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
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
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
