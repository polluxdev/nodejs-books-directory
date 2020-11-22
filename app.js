const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const bookRoutes = require("./routes/book");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

const MONGODB_URL = "mongodb://localhost:27017/books-directory";
const MONGODB_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, PATCH, DELETE"
//     );
//     return res.status(200).json({});
//   }
//   next();
// });

app.use("/api", bookRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
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
