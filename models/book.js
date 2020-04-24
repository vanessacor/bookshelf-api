"use strict";

const mongoose = require("mongoose");
// mongoose.set("toJSON", { virtuals: true });

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  status: {
    type: String,
    required: true,
    enum: ["Read", "Unread"],
    default: "Unread",
  },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
});

// Virtual for book's URL
BookSchema.virtual("url").get(function () {
  return "/book/" + this._id;
});

// BookSchema.toJSON({ virtuals: true });

// Export model
module.exports = mongoose.model("Book", BookSchema);
