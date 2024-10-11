const express = require("express");
const register = require("./register");
const login = require("./login");
const { searchFriend, inviteFriend } = require('./friends');
const uploadFile = require("./upload");
const loggedIn = require("./loggedIn"); 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/upload", loggedIn, uploadFile); 
router.post('/search-friend', loggedIn, searchFriend);
router.post('/invite-friend', loggedIn, inviteFriend);

module.exports = router;
