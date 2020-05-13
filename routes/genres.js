const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ValidationError = mongoose.Error.ValidationError;

const Genre = require("../models/genre");
const Author = require("../models/author");
const Book = require("../models/book");
const toJson = require("../models/toJson");

router.get("/", (req, res, next) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec()
    .then((listOfGenres) => {
      const data = toJson.genresToJson(listOfGenres);
      res.json(data);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  const genre = Genre.findById(req.params.id).exec();

  const books = Book.find({ genre: req.params.id }).populate("author").exec();

  Promise.all([genre, books])
    .then((results) => {
      if (!results[0]) {
        return next();
      }

      const genre = toJson.genreToJson(results[0]);
      const books = toJson.booksToJson(results[1], ["author"]);
      genre.books = books;

      res.json(genre);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const genre = new Genre({ name: req.body.name });
  genre
    .save()
    .then(() => {
      res.status(201).json(genre);
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
  const data = { name: req.body.name };

  Author.findByIdAndUpdate(req.params.id, data, { new: true })
    .then((genre) => {
      if (!genre) {
        return next();
      }
      res.status(200).json(genre);
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
  const id = req.params.id;
  Book.find({ genre: id }).then((books) => {
    if (books.length) {
      res.status(403);
      res.json({ message: "invalid operation" });
    } else {
      Genre.findByIdAndRemove(id, {})
        .then((genre) => {
          if (!genre) {
            return next();
          }
          res.status(204).json();
        })
        .catch(next);
    }
  });
});

module.exports = router;
