const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ValidationError = mongoose.Error.ValidationError;

const Genre = require("../models/genre");
const Author = require("../models/author");
const Book = require("../models/book");

router.get("/", (req, res, next) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec()
    .then((listOfGenres) => {
      res.json(listOfGenres);
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/:id", (req, res, next) => {
  const genre = Genre.findById(req.params.id).exec();

  const books = Book.find({ genre: req.params.id }).exec();

  Promise.all([genre, books])
    .then((results) => {
      const genre = results[0];
      const books = results[1];
      if (!genre) {
        return next();
      }
      const data = {
        genre,
        books,
      };
      res.json(data);
    })
    .catch((error) => {
      next(error);
    });
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
