const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const ValidationError = mongoose.Error.ValidationError;

const Author = require("../models/author");
const Book = require("../models/book");
const Genre = require("../models/genre");

router.get("/", (req, res, next) => {
  Author.find()
    .sort([["familyName", "ascending"]])
    .exec()
    .then((listOfAuthors) => {
      res.json(listOfAuthors);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  const author = Author.findById(req.params.id).exec();

  const books = Book.find({ author: req.params.id }).exec();

  Promise.all([author, books])
    .then((results) => {
      const author = results[0];
      const books = results[1];
      if (!author) {
        return next();
      }
      const data = {
        author,
        books,
      };
      res.json(data);
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
      res.status(201).json(author);
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
      res.status(200).json(author);
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
