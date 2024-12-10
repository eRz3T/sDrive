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
const { createStorage, getUserStorages, getStorageDetails, getFileFromStorage, saveFileStorageContent, addFilesToStorage, removeFileFromStorage, editFileName, shareStorageWithMembers, saveConflictedFile, saveResolvedFileContent  } = require('../controllers/storages');
const { updateUser } = require('../controllers/userController');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Diff = require('diff');

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
router.post('/api/storage/share', loggedIn, shareStorageWithMembers);
router.post('/api/save-conflicted-file', loggedIn, saveConflictedFile);
router.post('/api/file-conflict/:fileId/resolve', loggedIn, saveResolvedFileContent);


router.get('/file-conflict', loggedIn, (req, res) => {
    const { fileId, storageId } = req.query;

    if (!fileId || !storageId) {
        console.error('Błąd: Brak wymaganych parametrów fileId lub storageId.');
        return res.status(400).send('Nieprawidłowe parametry zapytania.');
    }

    const tempDir = path.join(__dirname, '..', 'data', 'temp');
    const tempFilePath = path.join(tempDir, fileId);
    const tempFilePathTmp = path.join(
        tempDir,
        `${path.basename(fileId, path.extname(fileId))}_tmp${path.extname(fileId)}`
    );

    if (!fs.existsSync(tempFilePath) || !fs.existsSync(tempFilePathTmp)) {
        return res.status(404).send('Pliki tymczasowe nie istnieją.');
    }

    const serverContent = fs.readFileSync(tempFilePath, 'utf8');
    const localContent = fs.readFileSync(tempFilePathTmp, 'utf8');

    const Diff = require('diff');
    const diff = Diff.diffWords(serverContent, localContent);

    let diffHtml = '';
    diff.forEach((part) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'black';
        const fontWeight = part.added || part.removed ? 'bold' : 'normal';
        diffHtml += `<span style="color:${color}; font-weight:${fontWeight}">${part.value}</span>`;
    });

    res.render('fileconflict', {
        serverContent,
        diffHtml,
        fileId,
        storageId, // Przekazywanie storageId do widoku
    });
});





router.get('/share-storage/:id', loggedIn, (req, res) => {
    const storageId = req.params.id;
    const userId = req.user.safeid_users;

    dbFiles.query(
        'SELECT * FROM storages WHERE id_storages = ? AND owner_storages = ? AND active_storages = 1',
        [storageId, userId],
        (err, results) => {
            if (err) {
                console.error("Błąd podczas weryfikacji właściciela magazynu:", err);
                return res.status(500).send("Błąd serwera");
            }

            if (results.length === 0) {
                return res.status(403).send("Nie masz uprawnień do udostępnienia tego magazynu.");
            }

            // Logika udostępniania magazynu
            res.json({ status: "success", message: "Magazyn został udostępniony." });
        }
    );
});



router.get("/storage/:id", loggedIn, (req, res) => {
    const storageId = req.params.id; // ID magazynu z URL-a
    const safeId = req.user.safeid_users; // ID aktualnie zalogowanego użytkownika

    // Pobierz nazwę magazynu i właściciela
    dbFiles.query(
        `SELECT storages.*, logins.firstname_users, logins.lastname_users
         FROM storages
         JOIN sdrive_logins.users AS logins ON storages.owner_storages = logins.safeid_users
         WHERE storages.id_storages = ? AND storages.active_storages = 1`,
        [storageId],
        (err, storageResults) => {
            if (err) {
                console.error("Błąd podczas pobierania szczegółów magazynu:", err);
                return res.status(500).send("Błąd serwera");
            }

            if (storageResults.length === 0) {
                return res.status(404).send("Magazyn nie istnieje lub brak uprawnień.");
            }

            const storage = storageResults[0];
            const isOwner = storage.owner_storages === safeId; // Sprawdzenie, czy użytkownik jest właścicielem

            // Pobierz osoby, którym udostępniono magazyn
            dbLogins.query(
                `SELECT users.firstname_users, users.lastname_users
                 FROM sdrive_logins.members_storages AS members
                 JOIN sdrive_logins.users AS users ON members.id_user_members_storages = users.id_users
                 WHERE members.id_storage_members_storages = ? AND members.active_members_storages = 1`,
                [storageId],
                (err, sharedWithResults) => {
                    if (err) {
                        console.error("Błąd podczas pobierania listy osób:", err);
                        return res.status(500).send("Błąd serwera");
                    }

                    // Pobierz pliki w magazynie
                    dbFiles.query(
                        `SELECT f.originalname_files, f.cryptedname_files, sf.date_storages_file, sf.file_version_storages_files
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
                                `SELECT originalname_files, cryptedname_files
                                 FROM files
                                 WHERE cryptedowner_files = ?
                                 AND delete_files = 0
                                 AND (origin_file IS NULL OR origin_file != "storage")`,
                                [safeId],
                                (err, allUserFiles) => {
                                    if (err) {
                                        console.error("Błąd podczas pobierania plików użytkownika:", err);
                                        return res.status(500).send("Błąd serwera");
                                    }

                                    // Renderuj widok magazynu
                                    res.render("storage", {
                                        storageId,
                                        storageName: storage.name_storages,
                                        ownerName: `${storage.firstname_users} ${storage.lastname_users}`,
                                        sharedWith: sharedWithResults, // Lista osób, którym udostępniono magazyn
                                        files: storageFiles, // Pliki w magazynie
                                        allUserFiles, // Wszystkie pliki użytkownika
                                        isOwner, // Czy użytkownik jest właścicielem
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

router.get('/home', loggedIn, (req, res) => {
    if (req.user) {
        const safeId = req.user.safeid_users; // `safeid_users` z tabeli `users`
        const userId = req.user.id_users; // `id_users` z tabeli `users`

        // Pobierz pełną listę plików użytkownika, które nie pochodzą z magazynu
        dbFiles.query(
            `SELECT originalname_files, cryptedname_files, dateofupload_files 
             FROM files 
             WHERE cryptedowner_files = ? 
             AND delete_files = 0 
             AND (origin_file IS NULL OR origin_file != "storage") 
             ORDER BY dateofupload_files DESC`,
            [safeId],
            (err, allUserFiles) => {
                if (err) {
                    console.error("Błąd podczas pobierania plików użytkownika:", err);
                    return res.status(500).send("Błąd serwera");
                }

                // Wybierz trzy najnowsze pliki użytkownika z pełnej listy
                const latestUserFiles = allUserFiles.slice(0, 3);

                // Pobierz pełną listę plików udostępnionych użytkownikowi
                dbFiles.query(
                    `SELECT truename_fshare, file_fshare, date_fshare 
                     FROM fshare 
                     WHERE sharedowner_fshare = ? 
                     AND deleted_fshare = 0 
                     ORDER BY date_fshare DESC`,
                    [safeId],
                    (err, allSharedFiles) => {
                        if (err) {
                            console.error("Błąd podczas pobierania udostępnionych plików:", err);
                            return res.status(500).send("Błąd serwera");
                        }

                        // Wybierz trzy najnowsze pliki udostępnione użytkownikowi z pełnej listy
                        const latestSharedFiles = allSharedFiles.slice(0, 3);

                        // Pobierz magazyny udostępnione użytkownikowi
                        const querySharedStorages = `
                            SELECT 
                                storages.id_storages, -- Dodajemy id_storages
                                storages.name_storages,
                                users.firstname_users,
                                users.lastname_users
                            FROM 
                                sdrive_logins.members_storages AS members
                            JOIN 
                                sdrive_files.storages AS storages ON members.id_storage_members_storages = storages.id_storages
                            JOIN 
                                sdrive_logins.users AS users ON storages.owner_storages = users.safeid_users
                            WHERE 
                                members.id_user_members_storages = ?
                                AND members.active_members_storages = 1 
                                AND storages.active_storages = 1
                        `;
                        dbLogins.query(querySharedStorages, [userId], (err, sharedStorages) => {
                            if (err) {
                                console.error("Błąd podczas pobierania udostępnionych magazynów:", err);
                                return res.status(500).send("Błąd serwera");
                            }

                            // Pobierz listę znajomych
                            getFriends(req, {
                                json: ({ status, friends }) => {
                                    if (status === 'error') {
                                        console.error("Błąd podczas pobierania znajomych:", err);
                                        return res.status(500).send("Błąd serwera");
                                    }

                                    // Pobierz nieprzeczytane powiadomienia
                                    dbLogins.query(
                                        `SELECT id_notifications, head_notifications, date_notifications 
                                         FROM notifications 
                                         WHERE user_notifications = ? 
                                         AND status_notifications = "unread"`,
                                        [safeId],
                                        (err, notifications) => {
                                            if (err) {
                                                console.error("Błąd podczas pobierania powiadomień:", err);
                                                return res.status(500).send("Błąd serwera");
                                            }

                                            console.log("Pobrano powiadomienia:", notifications);

                                            // Renderuj widok home z pełnymi danymi
                                            res.render('home', {
                                                user: req.user,
                                                files: latestUserFiles, // Najnowsze pliki użytkownika
                                                allUserFiles: allUserFiles, // Wszystkie pliki użytkownika
                                                sharedFiles: latestSharedFiles, // Najnowsze pliki udostępnione użytkownikowi
                                                allSharedFiles: allSharedFiles, // Wszystkie udostępnione pliki
                                                sharedStorages: sharedStorages, // Lista udostępnionych magazynów z id_storages
                                                friends: friends, // Lista znajomych
                                                notifications: notifications // Lista powiadomień
                                            });
                                        }
                                    );
                                }
                            });
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
