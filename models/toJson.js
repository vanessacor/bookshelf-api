function booksToJson(books) {
  const data = books.map((book) => bookToJson(book));
  return data;
}

function bookToJson(book) {
  const { id, title, summary, isbn, url } = book;
  const author = book.author ? authorToJson(book.author) : null;
  const genre = book.genre ? genresToJson(book.genre) : null;
  const data = {
    id,
    title,
    author,
    genre,
    summary,
    isbn,
    url,
  };
  return data;
}

function authorsToJson(authors) {
  const data = authors.map((author) => authorToJson(author));
  return data;
}

function authorToJson(author) {
  const { id, name, lifespan, url } = author;
  const data = {
    id,
    name,
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
