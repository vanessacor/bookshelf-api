function booksToJson(books, details = ["genre", "author"]) {
  const data = books.map((book) => bookToJson(book, details));
  return data;
}

function bookToJson(book, details = ["genre", "author"]) {
  const { id, title, status, summary, isbn, url } = book;
  const data = {
    id,
    title,
    status,
    summary,
    isbn,
    url,
  };

  if (book.author && details.includes("author")) {
    data.author = authorToJson(book.author);
  }

  if (book.genre && details.includes("genre")) {
    data.genre = genresToJson(book.genre);
  }
  return data;
}

function authorsToJson(authors) {
  const data = authors.map((author) => authorToJson(author));
  return data;
}

function authorToJson(author) {
  const {
    id,
    firstName,
    familyName,
    name,
    dateOfBirth,
    dateOfDeath,
    lifespan,
    url,
  } = author;
  const data = {
    id,
    firstName,
    familyName,
    name,
    dateOfBirth,
    dateOfDeath,
    lifespan,
    url,
  };
  return data;
}

function genresToJson(genres) {
  const data = genres.map((genre) => genreToJson(genre));
  return data;
}

function genreToJson(genre) {
  const { id, name, url } = genre;
  const data = {
    id,
    name,
    url,
  };
  return data;
}

module.exports = {
  authorsToJson,
  authorToJson,
  booksToJson,
  bookToJson,
  genresToJson,
  genreToJson,
};
