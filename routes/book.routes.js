const router = require("express").Router();

const Book = require("../models/Book.model.js");

//GET route to display form:
router.get("/books/create", (req, res) => res.render("books/book-create.hbs"));

//POST route to save new book to database:
router.post("/books/create", (req, res, next) => {
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(() => res.redirect("/books"))
    .catch((err) => next(err));
});

//GET route to display form for editing
router.get("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .then((bookToEdit) => {
      res.render("books/book-edit.hbs", { book: bookToEdit });
    })
    .catch((error) => next(error));
});

//POST route to make updates on specific book
router.post("/books/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { title, description, author, rating },
    { new: true }
  )
    .then((updatedBook) => res.redirect(`/books/${updatedBook.id}`))
    .catch((error) => next(error));
});

//POST route to delete book from database
router.post("/books/:bookId/delete", (req, res) => {
  const { bookId } = req.params;

  Book.findByIdAndDelete(bookId)
    .then(() => res.redirect("/books"))
    .catch((error) => next(error));
});

//GET route to retrieve and display all the books
router.get("/books", (req, res, next) => {
  Book.find()
    .then((allTheBooksFromDB) => {
      console.log(allTheBooksFromDB);
      res.render("books/books-list.hbs", { books: allTheBooksFromDB }); //pass console all books to view
    })
    .catch((err) => {
      console.log("Error occurred:", err);
      //call error middleware to display error page!!
      next(err);
    });
});

//GET route to retrieve and display details of a specific books;
router.get("/books/:bookId", (req, res) => {
  const { bookId } = req.params;

  Book.findById(bookId)
    .then((theBook) => res.render("books/book-details.hbs", { book: theBook }))
    .catch((error) => {
      console.log("error occurred: ", error);

      //error middleware
      next(error);
    });
});

module.exports = router;
