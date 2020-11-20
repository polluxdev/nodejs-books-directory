const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      return res.status(409).json({ message: "Email has already exist!" });
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created successfully!",
      data: {
        _id: result._id,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Auth failed!" });
    }
    const isPwEqual = await bcrypt.compare(password, user.password);
    if (isPwEqual) {
      const token = await jwt.sign(
        { userId: user._id, email: user.email },
        "very_long_long_long_secret_string",
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Login successfully!", token: token });
    }
    res.status(401).json({ message: "Auth failed!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
