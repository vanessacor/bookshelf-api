const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ValidationError = mongoose.Error.ValidationError;

const Author = require("../models/author");
const Book = require("../models/book");
const Genre = require("../models/genre");
const toJson = require("../models/toJson");

router.get("/", (req, res, next) => {
  Author.find()
    .sort([["familyName", "ascending"]])
    .exec()
    .then((listOfAuthors) => {
      const data = toJson.authorsToJson(listOfAuthors);
      res.json(data);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  const author = Author.findById(req.params.id).exec();

  const books = Book.find({ author: req.params.id }).populate("genre").exec();

  Promise.all([author, books])
    .then((results) => {
      if (!results[0]) {
        return next();
      }

      const author = toJson.authorToJson(results[0]);
      const books = toJson.booksToJson(results[1], ["genre"]);
      author.books = books;

      res.json(author);
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  const author = new Author({
    firstName: req.body.firstName,
    familyName: req.body.familyName,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
  });

  author
    .save()
    .then(() => {
      const data = toJson.authorToJson(author);
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
    firstName: req.body.firstName,
    familyName: req.body.familyName,
    dateOfBirth: req.body.dateOfBirth,
    dateOfDeath: req.body.dateOfDeath,
  };

  Author.findByIdAndUpdate(req.params.id, data, { new: true })
    .then((author) => {
      if (!author) {
        return next();
      }
      const data = toJson.authorToJson(author);
      res.status(200).json(data);
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
  Book.find({ author: id }).then((books) => {
    if (books.length) {
      res.status(403);
      res.json({ message: "invalid operation" });
    } else {
      Author.findByIdAndRemove(id, {})
        .then((author) => {
          if (!author) {
            return next();
          }
          res.status(204).json();
        })
        .catch(next);
    }
  });
});

module.exports = router;
