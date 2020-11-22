const express = require("express");

const userController = require("../controllers/user");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get("/users", isAuth, userController.getUsers);

router.get("/user/:userId", isAuth, userController.getUser);

router.patch("/user/:userId", isAuth, userController.updateUser);

router.delete("/user/:userId", isAuth, userController.deleteUser);

module.exports = router;
