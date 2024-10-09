const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const downloadFile = require("../controllers/download");
const deleteFile = require("../controllers/deleteFile");
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Trasa do usuwania plików z weryfikacją czy użytkownik jest zalogowany
router.delete("/delete/:filename", loggedIn, deleteFile);

// Trasa do pobierania plików z weryfikacją, czy użytkownik jest zalogowany
router.get("/download/:filename", loggedIn, downloadFile);

// Trasa do strony "home" z weryfikacją, czy użytkownik jest zalogowany
router.get("/home", loggedIn, (req, res) => {
    if (req.user) {
        const userEmail = req.user.email_users;
        const userDir = path.join(__dirname, '..', 'data', 'users', userEmail);
        
        // Sprawdź, czy folder użytkownika istnieje
        let files = [];
        if (fs.existsSync(userDir)) {
            files = fs.readdirSync(userDir); // Pobierz listę plików w folderze użytkownika
        }
        
        // Przekaż pliki do widoku home.ejs
        res.render("home", { user: req.user, files: files });
    } else {
        res.redirect("/login");
    }
});

// Inne trasy...
router.get("/", loggedIn, (req, res) => {
    if (req.user) {
        res.render("welcome", { status: "loggedIn", user: req.user });
    } else {
        res.render("welcome", { status: "no", user: "nothing" });
    }
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/logout", logout);

module.exports = router;
