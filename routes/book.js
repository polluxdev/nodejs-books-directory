const express = require("express");

const bookController = require("../controllers/book");

const router = express.Router();

router.get("/books", bookController.getBooks);

router.post("/book", bookController.createBook);

router.get("/book/:bookId", bookController.getBook);

router.patch("/book/:bookId", bookController.updateBook);

router.delete("/book/:bookId", bookController.deleteBook);

module.exports = router;
