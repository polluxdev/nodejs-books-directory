const express = require("express");

const bookController = require("../controllers/book");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/books", bookController.getBooks);

router.post("/book", isAuth, bookController.createBook);

router.get("/book/:bookId", bookController.getBook);

router.patch("/book/:bookId", isAuth, bookController.updateBook);

router.delete("/book/:bookId", isAuth, bookController.deleteBook);

module.exports = router;
