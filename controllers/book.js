const mongoose = require("mongoose");
const Book = require("../models/book");

exports.getBooks = (req, res, next) => {
  Book.find()
    .select("_id title description author year")
    .exec()
    .then((books) => {
      const response = {
        count: books.length,
        data: books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            description: book.description,
            year: book.year,
            request: {
              type: "GET",
              url: "http://localhost:3000/api/book/" + book._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.createBook = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const author = req.body.author;
  const year = req.body.year;
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title: title,
    description: description,
    author: author,
    year: year,
  });
  book
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Book created successfully!",
        data: {
          _id: result._id,
          title: result.title,
          description: result.description,
          author: result.author,
          year: result.year,
          request: {
            type: "GET",
            url: "http://localhost:3000/api/book/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.getBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .select("_id title description author year")
    .then((book) => {
      if (book) {
        res
          .status(200)
          .json({ message: "Book fetced successfully", data: book });
      } else {
        res.status(404).json({ message: "No valid book with the ID." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.updateBook = (req, res, next) => {
  const bookId = req.params.bookId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Book.update({ _id: bookId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res
        .status(200)
        .json({ message: "Book updated successfully!", book: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.deleteOne({ _id: bookId })
    .then((result) => {
      res
        .status(200)
        .json({
          message: "Book deleted successfully!",
          result: { _id: bookId },
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
