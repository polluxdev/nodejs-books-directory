const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.log(req.file);
    if (req.file) {
      fs.unlink(path.join(__dirname, "..", req.file.path), (err) =>
        console.log(err)
      );
    }
    const error = new Error("Auth Failed!");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "very_long_long_long_secret_string");
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  if (!decodedToken) {
    console.log(req.file);
    const error = new Error("Auth Failed!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  req.token = token;
  next();
};
