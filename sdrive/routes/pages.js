const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const downloadFile = require("../controllers/download");
const deleteFile = require("../controllers/deleteFile");
const { showFileContent, removeHtmlFile } = require("../controllers/fileController"); // Import kontrolera plików
const { getNotification } = require('../controllers/notifications');
const { dbFiles } = require("../routes/db-config");
const { dbLogins } = require("../routes/db-config");
const { markNotificationAsRead } = require('../controllers/notifications');
const { respondToFriendRequest } = require("../controllers/friends");
const { getFriends, removeFriend } = require('../controllers/friends');
const router = express.Router();


// Trasa do wyświetlania zawartości pliku
router.get("/show/:filename", loggedIn, showFileContent);

// Trasa do usuwania plików HTML
router.post("/remove-html", removeHtmlFile);

// Trasa do usuwania plików z weryfikacją, czy użytkownik jest zalogowany
router.delete("/delete/:filename", loggedIn, deleteFile);

// Trasa do pobierania plików z weryfikacją, czy użytkownik jest zalogowany
router.get("/download/:filename", loggedIn, downloadFile);

// Trasa do usuwania plików z weryfikacją czy użytkownik jest zalogowany
router.delete("/delete/:filename", loggedIn, deleteFile);

// Trasa do pobierania plików z weryfikacją, czy użytkownik jest zalogowany
router.get("/download/:filename", loggedIn, downloadFile);

router.get('/api/notification/:id', loggedIn, getNotification);

// Nowa trasa do obsługi akceptacji/odrzucenia zaproszeń do znajomych
router.post("/api/respond-friend-request", loggedIn, respondToFriendRequest);

//Trasy obsługi znajomych - lista i usuwanie
router.get('/api/get-friends', loggedIn, getFriends);
router.post('/api/remove-friend', loggedIn, removeFriend);

router.post('/api/notification/:id/read', markNotificationAsRead);

// Trasa do strony "home" z weryfikacją, czy użytkownik jest zalogowany
// Pobierz listę powiadomień, które mają status "unread"
router.get('/home', loggedIn, (req, res) => {
    if (req.user) {
        const safeId = req.user.safeid_users;

        // Pobierz listę plików przypisanych do użytkownika na podstawie safeid_users
        dbFiles.query('SELECT originalname_files, cryptedname_files FROM files WHERE cryptedowner_files = ?', [safeId], (err, files) => {
            if (err) throw err;

            // Pobierz tylko nieprzeczytane powiadomienia
            dbLogins.query('SELECT id_notifications, head_notifications, date_notifications FROM notifications WHERE user_notifications = ? AND status_notifications = "unread"', [safeId], (err, notifications) => {
                if (err) throw err;

                // Przekaż listę plików i powiadomień do widoku home.ejs
                res.render('home', { user: req.user, files: files, notifications: notifications });
            });
        });
    } else {
        res.redirect('/login');
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
