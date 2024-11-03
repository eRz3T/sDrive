const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const {deleteFile, deleteSharedFile} = require("../controllers/deleteFile");
const { showUserFileContent, showSharedFileContent, removeHtmlFile } = require("../controllers/fileController");
const { getNotification, markNotificationAsRead, getReadNotifications } = require('../controllers/notifications');
const { dbFiles } = require("../routes/db-config");
const { dbLogins } = require("../routes/db-config");
const { startNewConversation, getConversations, getMessages, sendMessage } = require('../controllers/messages');
const { respondToFriendRequest, getFriends, removeFriend } = require("../controllers/friends");
const { downloadFile, downloadSharedFile } = require("../controllers/download");
const { shareFile, shareSharedFile } = require('../controllers/shareFile');
const router = express.Router();

// Użyj odpowiednich kontrolerów do wyświetlania plików użytkownika i udostępnionych plików
router.get("/show/:filename", loggedIn, showUserFileContent);
router.get("/show/shared/:filename", loggedIn, showSharedFileContent);

router.post("/remove-html", removeHtmlFile);
router.delete("/delete/:filename", loggedIn, deleteFile);
router.get("/download/:filename", loggedIn, downloadFile);
router.get("/download/shared/:filename", loggedIn, downloadSharedFile);
router.delete("/delete/shared/:filename", loggedIn, deleteSharedFile);
router.post('/api/start-conversation', loggedIn, startNewConversation);
router.get('/api/get-conversations', loggedIn, getConversations);
router.get('/api/get-messages', loggedIn, getMessages);
router.post('/api/send-message', loggedIn, sendMessage);
router.post('/api/share-shared-file', loggedIn, shareSharedFile);
router.get('/api/notification/:id', loggedIn, getNotification);
router.post('/api/notification/:id/read', markNotificationAsRead);
router.get('/api/read-notifications', loggedIn, getReadNotifications);
router.post("/api/respond-friend-request", loggedIn, respondToFriendRequest);
router.get('/api/get-friends', loggedIn, getFriends);
router.post('/api/remove-friend', loggedIn, removeFriend);

router.get('/home', loggedIn, (req, res) => {
    if (req.user) {
        const safeId = req.user.safeid_users;

        // Pobierz pełną listę plików użytkownika
        dbFiles.query(
            'SELECT originalname_files, cryptedname_files, dateofupload_files FROM files WHERE cryptedowner_files = ? AND delete_files = 0 ORDER BY dateofupload_files DESC',
            [safeId],
            (err, allUserFiles) => {
                if (err) throw err;

                // Wybierz trzy najnowsze pliki użytkownika z pełnej listy
                const latestUserFiles = allUserFiles.slice(0, 3);

                // Pobierz pełną listę plików udostępnionych użytkownikowi
                dbFiles.query(
                    'SELECT truename_fshare, file_fshare, date_fshare FROM fshare WHERE sharedowner_fshare = ? AND deleted_fshare = 0 ORDER BY date_fshare DESC',
                    [safeId],
                    (err, allSharedFiles) => {
                        if (err) throw err;

                        // Wybierz trzy najnowsze pliki udostępnione użytkownikowi z pełnej listy
                        const latestSharedFiles = allSharedFiles.slice(0, 3);

                        // Użyj funkcji getFriends do pobrania znajomych
                        getFriends(req, {
                            json: ({ status, friends }) => {
                                if (status === 'error') {
                                    console.error('Błąd podczas pobierania znajomych');
                                    return res.status(500).send('Błąd serwera');
                                }

                                // Pobierz nieprzeczytane powiadomienia
                                dbLogins.query(
                                    'SELECT id_notifications, head_notifications, date_notifications FROM notifications WHERE user_notifications = ? AND status_notifications = "unread"',
                                    [safeId],
                                    (err, notifications) => {
                                        if (err) throw err;

                                        console.log('Pobrano powiadomienia:', notifications);

                                        // Renderuj widok home z pełnymi i najnowszymi listami plików, znajomymi, powiadomieniami i udostępnionymi plikami
                                        res.render('home', {
                                            user: req.user,
                                            files: latestUserFiles,
                                            allUserFiles: allUserFiles,
                                            friends: friends, // Przekazujemy znajomych
                                            notifications: notifications,
                                            sharedFiles: latestSharedFiles,
                                            allSharedFiles: allSharedFiles
                                        });
                                    }
                                );
                            }
                        });
                    }
                );
            }
        );
    } else {
        res.redirect('/login');
    }
});

router.post('/api/share-file', loggedIn, (req, res) => {
    console.log('Rozpoczęto udostępnianie pliku:', req.body);
    shareFile(req, res);
});

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/logout", logout);

module.exports = router;
