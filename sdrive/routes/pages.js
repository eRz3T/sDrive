const express = require("express");
const loggedIn = require("../controllers/loggedIn");
const logout = require("../controllers/logout");
const {deleteFile, deleteSharedFile} = require("../controllers/deleteFile");
const { showUserFileContent, showSharedFileContent, removeHtmlFile, saveFileContent, getFileContent, renameFile } = require("../controllers/fileController");
const { getNotification, markNotificationAsRead, getReadNotifications } = require('../controllers/notifications');
const { dbFiles } = require("../routes/db-config");
const { dbLogins } = require("../routes/db-config");
const { startNewConversation, getConversations, getMessages, sendMessage } = require('../controllers/messages');
const { respondToFriendRequest, getFriends, removeFriend } = require("../controllers/friends");
const { downloadFile, downloadSharedFile, downloadStorage } = require("../controllers/download");
const { shareFile, shareSharedFile } = require('../controllers/shareFile');
const { createStorage, getUserStorages, getStorageDetails, getFileFromStorage, saveFileStorageContent, addFilesToStorage, removeFileFromStorage, editFileName } = require('../controllers/storages');
const { updateUser } = require('../controllers/userController');
const router = express.Router();

router.get("/show/:filename", loggedIn, showUserFileContent);
router.get("/show/shared/:filename", loggedIn, showSharedFileContent);
router.post('/api/file/:filename/save', loggedIn, saveFileContent);
router.get('/api/file/:filename/edit', loggedIn, getFileContent);
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
router.get('/api/get-user-storages', loggedIn, getUserStorages);
router.get('/api/storage-file/:fileId/edit', loggedIn, getFileFromStorage);
router.post('/api/storage-file/:fileId/save', loggedIn, saveFileStorageContent);
router.post('/api/storage/:storageId/remove-file/:fileId', loggedIn, removeFileFromStorage);
router.post("/api/storage/:storageId/edit-file-name/:fileId", loggedIn, editFileName);
router.post('/api/file/rename/:fileId', loggedIn, renameFile);
router.post('/api/user/update', loggedIn, updateUser);

router.get("/storage/:id", loggedIn, (req, res) => {
    const storageId = req.params.id;
    const safeId = req.user.safeid_users;

    // Pobierz nazwę magazynu
    dbFiles.query(
        'SELECT name_storages FROM storages WHERE id_storages = ? AND owner_storages = ? AND active_storages = 1',
        [storageId, safeId],
        (err, storageResults) => {
            if (err) {
                console.error("Błąd podczas pobierania szczegółów magazynu:", err);
                return res.status(500).send("Błąd serwera");
            }

            if (storageResults.length === 0) {
                return res.status(404).send("Magazyn nie istnieje lub brak uprawnień.");
            }

            const storageName = storageResults[0].name_storages;

            // Pobierz pliki w magazynie (uwzględniając datę dodania)
            dbFiles.query(
                `SELECT f.originalname_files, f.cryptedname_files, sf.date_storages_file 
                 FROM storages_files sf 
                 JOIN files f ON sf.id_files = f.id_files 
                 WHERE sf.id_storages = ? AND sf.active_storages_files = 1`,
                [storageId],
                (err, storageFiles) => {
                    if (err) {
                        console.error("Błąd podczas pobierania plików magazynu:", err);
                        return res.status(500).send("Błąd serwera");
                    }

                    // Pobierz wszystkie pliki użytkownika (poza magazynem)
                    dbFiles.query(
                        'SELECT originalname_files, cryptedname_files FROM files WHERE cryptedowner_files = ? AND delete_files = 0 AND (origin_file IS NULL OR origin_file != "storage")',
                        [safeId],
                        (err, allUserFiles) => {
                            if (err) {
                                console.error("Błąd podczas pobierania plików użytkownika:", err);
                                return res.status(500).send("Błąd serwera");
                            }

                            // Renderuj widok magazynu
                            res.render("storage", {
                                storageId,
                                storageName,
                                files: storageFiles,
                                allUserFiles, // Przekazujemy wszystkie pliki użytkownika
                            });
                        }
                    );
                }
            );
        }
    );
});




router.get('/home', loggedIn, (req, res) => {
    if (req.user) {
        const safeId = req.user.safeid_users;

        // Pobierz pełną listę plików użytkownika, które nie pochodzą z magazynu
        dbFiles.query(
            'SELECT originalname_files, cryptedname_files, dateofupload_files FROM files WHERE cryptedowner_files = ? AND delete_files = 0 AND (origin_file IS NULL OR origin_file != "storage") ORDER BY dateofupload_files DESC',
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
                                            files: latestUserFiles, // Filtruje tylko pliki bez origin_file = "storage"
                                            allUserFiles: allUserFiles,
                                            friends: friends, // Przekazujemy znajomych
                                            notifications: notifications,
                                            sharedFiles: latestSharedFiles,
                                            allSharedFiles: allSharedFiles
                                        });
                                        console.log('DEBUG: Przekazywane allUserFiles:', allUserFiles);
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

router.post('/api/storage/:storageId/add-files', loggedIn, addFilesToStorage);


router.get('/edit/:filename', loggedIn, (req, res) => {
    const { filename } = req.params;
    console.log('DEBUG: Pobieranie edycji pliku:', filename);

    if (!filename || filename.includes('/') || filename.includes('..')) {
        console.error("Nieprawidłowa nazwa pliku:", filename);
        return res.status(400).send("Nieprawidłowa nazwa pliku");
    }

    dbFiles.query(
        'SELECT originalname_files FROM files WHERE cryptedname_files = ?',
        [filename],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Błąd serwera');
            }

            if (results.length === 0) {
                console.error("Plik nie znaleziony:", filename);
                return res.status(404).send('Plik nie znaleziony');
            }

            const originalName = results[0].originalname_files;
            res.render('editFile', { filename, originalName });
        }
    );
});


router.get('/download-storage/:storageId', loggedIn, downloadStorage);



router.post('/create-storage', loggedIn, (req, res, next) => {
    console.log('Żądanie POST /create-storage:', req.body);
    next();
}, createStorage);

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
