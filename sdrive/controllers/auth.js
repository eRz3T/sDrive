const express = require("express");
const register = require("./register");
const login = require("./login");
const uploadFile = require("./upload");
const loggedIn = require("./loggedIn"); // Import middleware

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/upload", loggedIn, uploadFile); // Trasa do przesyłania pliku

module.exports = router;
