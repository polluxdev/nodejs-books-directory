const mongoose = require("mongoose");
const book = require("../models/book");

const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const response = {
      count: users.length,
      data: users.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          request: {
            type: "GET",
            url: "http://localhost:3000/api/user/" + user._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("_id name email");
    if (user) {
      res.status(200).json({
        message: "User fetced successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(404).json({ message: "No valid user with the ID." });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("No user found!");
      error.statusCode = 404;
      throw error;
    }
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      if (checkUser._id.toString() !== userId) {
        return res.status(409).json({ message: "Email has already exist!" });
      }
    }
    user.name = name;
    user.email = email;
    if (password) {
      const hashedPw = await bcrypt.hash(password, 12);
      user.password = hashedPw;
    }
    const result = await user.save();
    res
      .status(200)
      .json({ message: "User updated successfully!", data: result });
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
    if (userId === req.userId) {
      return res.status(404).json({ message: "Delete user failed!" });
    }
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
