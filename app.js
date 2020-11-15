const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./routes/book");

const app = express();

const MONGODB_URL = "mongodb://localhost:27017/books-directory";
const MONGODB_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

app.use("/api", bookRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

mongoose
  .connect(MONGODB_URL, MONGODB_OPTIONS)
  .then(() => {
    app.listen(3000);
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Database connection failed!");
  });
