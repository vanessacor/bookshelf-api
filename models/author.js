"use strict";

const moment = require("moment");
const mongoose = require("mongoose");
// mongoose.set("toJSON", { virtuals: true });
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  familyName: { type: String, required: true, max: 100 },
  dateOfBirth: { type: Date },
  dateOfDeath: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.firstName && this.familyName) {
    fullname = this.familyName + ", " + this.firstName;
  }
  if (!this.firstName || !this.familyName) {
    fullname = "";
  }

  return fullname;
});

AuthorSchema.virtual("lifespan").get(function () {
  if (!this.dateOfDeath) {
    const today = new Date();
    return (today.getYear() - this.dateOfBirth.getYear()).toString();
  }
  return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear()).toString();
});

AuthorSchema.virtual("url").get(function () {
  return "/authors/" + this._id;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return moment(this.dateOfBirth).format("MMMM Do, YYYY");
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return moment(this.dateOfDeath).format("MMMM Do, YYYY");
});

// AuthorSchema.toJSON({ virtuals: true });

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
