const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const downloadFile = require("../controllers/download");
const deleteFile = require("../controllers/deleteFile");
const { dbFiles } = require("../routes/db-config");
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get("/show/:filename", loggedIn, (req, res) => {
    const safeId = req.user.safeid_users;  // Pobieramy safeid użytkownika (cryptedowner_files)
    const filename = req.params.filename;  // Pobieramy zaszyfrowaną nazwę pliku (cryptedname_files)

    // Tworzymy pełną ścieżkę do pliku w folderze o nazwie safeid_users
    const filePath = path.join(__dirname, '..', 'data', 'users', safeId, filename);

    // Logowanie ścieżki dla debugowania
    console.log(`Sprawdzana ścieżka pliku: ${filePath}`);

    // Sprawdź, czy plik istnieje
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Błąd podczas czytania pliku:', err);
                return res.status(500).send("Błąd podczas czytania pliku");
            }
            res.send(data);  // Zwraca zawartość pliku tekstowego
        });
    } else {
        console.log(`Plik ${filename} nie istnieje w ścieżce ${filePath}`);
        res.status(404).send("Plik nie istnieje");
    }
});

// Trasa do usuwania plików z weryfikacją czy użytkownik jest zalogowany
router.delete("/delete/:filename", loggedIn, deleteFile);

// Trasa do pobierania plików z weryfikacją, czy użytkownik jest zalogowany
router.get("/download/:filename", loggedIn, downloadFile);


// Trasa do strony "home" z weryfikacją, czy użytkownik jest zalogowany
router.get("/home", loggedIn, (req, res) => {
    if (req.user) {
        const safeId = req.user.safeid_users;

        // Pobierz listę plików przypisanych do użytkownika na podstawie safeid_users
        dbFiles.query('SELECT originalname_files, cryptedname_files FROM files WHERE cryptedowner_files = ?', [safeId], (err, files) => {
            if (err) throw err;

            // Przekaż listę plików do widoku home.ejs
            res.render("home", { user: req.user, files: files });
        });
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
