const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ValidationError = mongoose.Error.ValidationError;

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const toJson = require("../models/toJson");

router.get("/", (req, res, next) => {
  Book.find()
    .populate("author")
    .populate("genre")
    .exec()
    .then((listOfBooks) => {
      const data = toJson.booksToJson(listOfBooks);
      res.json(data);
    })
    .catch(next); // same as catch((err) => next(err))
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return next();
  }
  Book.findById(id)
    .populate("author")
    .populate("genre")
    .exec()
    .then((book) => {
      if (!book) {
        return next();
      }
      const data = toJson.bookToJson(book);
      res.json(data);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const { title, author, genre, status, summary, isbn } = req.body;
  const book = new Book({
    title,
    author,
    genre,
    status,
    summary,
    isbn,
  });
  book
    .save()
    .then(() => {
      const data = toJson.bookToJson(book);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(422);
        return res.json({ message: err.message });
      }
      next(err);
    });
});

router.put("/:id", (req, res, next) => {
  const id = req.body.id;
  if (!mongoose.isValidObjectId(id)) {
    return next();
  }
  const data = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    status: req.body.status,
    summary: req.body.summary,
    isbn: req.body.isbn,
  };

  Book.findByIdAndUpdate(req.params.id, data, { new: true })
    .then((book) => {
      if (!book) {
        return next();
      }
      res.status(200).json(book);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(422);
        return res.json({ message: err.message });
      }
      next(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Book.findByIdAndRemove(req.params.id, {})
    .then((book) => {
      if (!book) {
        return next();
      }

      res.status(204).json();
    })

    .catch(next);
});

module.exports = router;
