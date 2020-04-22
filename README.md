# My Books API

This is my first RESTful API built from scratch. It's a follow up of my backend rendered [website](https://pacific-hamlet-13856.herokuapp.com/catalog/)

## Getting Started

```
npm install
npm start
```

## Endpoints

### /book

- GET /book - list all books
- GET /book/:id - detail of a specific book
- POST /book - creates new book, responds with 201 when success.
- PUT /book/:id - update an existing book, responds with 200 when success.
- DELETE /book:id - deletes a specific book.

### /author

- GET /author - list all authors
- GET /author/:id - detail of a specific author
- POST /author - creates new author, responds with 201 when success.
- PUT /author/:id - update an existing author, responds with 200 when success.
- DELETE /author:id - deletes a specific author, responds with 403 if there are books of that author.

### /genre

- GET /genre - list all genres
- GET /genre/:id - detail of a specific genre
- POST /genre - creates new genre, responds with 201 when success.
- PUT /genre/:id - update an existing genre, responds with 200 when success.
- DELETE /genre:id - deletes a specific genre, responds with 403 if there are books with that genre.

## todo

-
