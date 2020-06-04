var express = require("express");
var router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");

/* GET home page. */
router.get("/", function (req, res, next) {
  const bookQuery = Book.countDocuments({}).exec();
  const bookReadQuery = Book.countDocuments({ status: "Read" }).exec();
  const bookUnreadQuery = Book.countDocuments({ status: "Unread" }).exec();
  const authorQuery = Author.countDocuments({}).exec();
  const genreQuery = Genre.countDocuments({}).exec();
  Promise.all([
    bookQuery,
    bookReadQuery,
    bookUnreadQuery,
    authorQuery,
    genreQuery,
  ]).then((results) => {
    const bookCount = results[0];
    const bookReadCount = results[1];
    const bookUnreadCount = results[2];
    const authorCount = results[3];
    const genreCount = results[4];

    const count = {
      bookCount,
      bookReadCount,
      bookUnreadCount,
      authorCount,
      genreCount,
    };

    res.json({ name: "Books API", count });
  });
});

module.exports = router;
