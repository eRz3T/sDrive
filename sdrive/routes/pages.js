const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const router = express.Router();

// Trasa do strony "home" z weryfikacją, czy użytkownik jest zalogowany
router.get("/home", loggedIn, (req, res) => {
    if (req.user) {
        // Jeśli użytkownik jest zalogowany, renderuj stronę "home.ejs"
        res.render("home", { user: req.user });
    } else {
        // Jeśli użytkownik nie jest zalogowany, przekieruj go na stronę logowania
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
