const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const { dbFiles } = require("../routes/db-config");

// Konfiguracja Multer do przechowywania plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const safeId = req.user.safeid_users;
        const userDir = path.join(__dirname, '..', 'data', 'users', safeId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log(`Utworzono katalog dla użytkownika z safeid: ${safeId}`);
        }

        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const cryptedName = crypto.randomBytes(16).toString('hex') + path.extname(originalName);
        console.log(`Przesyłanie pliku: ${originalName} (zaszyfrowana nazwa: ${cryptedName})`);
        cb(null, cryptedName);
    }
});

// Inicjalizacja multer po skonfigurowaniu storage
const upload = multer({ storage: storage }).single('file');

// Funkcja obsługująca przesyłanie pliku i zapisywanie informacji do bazy
const uploadFile = (req, res) => {
    const safeId = req.user.safeid_users;
    console.log(`Rozpoczęto przesyłanie pliku przez użytkownika z safeid: ${safeId}`);

    upload(req, res, async (err) => {
        if (err) {
            console.error('Błąd podczas przesyłania pliku:', err);
            return res.json({ status: 'error', error: 'Błąd przesyłania pliku' });
        }

        const originalName = req.file.originalname;
        const cryptedName = req.file.filename;
        const fileType = path.extname(originalName).substring(1);
        const uploadDate = new Date();

        try {
            // Sprawdź, czy plik o tej nazwie już istnieje
            let uniqueOriginalName = originalName;
            const fileExtension = path.extname(originalName);
            const fileBaseName = path.basename(originalName, fileExtension);

            let suffix = 0;
            let isUnique = false;

            while (!isUnique) {
                const conflictingFiles = await new Promise((resolve, reject) => {
                    dbFiles.query(
                        'SELECT originalname_files FROM files WHERE originalname_files = ? AND cryptedowner_files = ? AND delete_files = 0',
                        [uniqueOriginalName, safeId],
                        (err, results) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(results);
                        }
                    );
                });

                if (conflictingFiles.length > 0) {
                    suffix++;
                    uniqueOriginalName = `${fileBaseName}(${suffix})${fileExtension}`;
                } else {
                    isUnique = true;
                }
            }

            // Zapisz dane pliku do bazy danych
            await new Promise((resolve, reject) => {
                dbFiles.query(
                    'INSERT INTO files (originalname_files, cryptedname_files, cryptedowner_files, filetype_files, delete_files, dateofupload_files) VALUES (?, ?, ?, ?, ?, ?)',
                    [uniqueOriginalName, cryptedName, safeId, fileType, 0, uploadDate],
                    (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    }
                );
            });

            console.log(`Plik ${uniqueOriginalName} został pomyślnie przesłany i zapisany w bazie danych.`);
            return res.json({ status: 'success', success: 'Plik przesłany i zapisany' });
        } catch (error) {
            console.error('Błąd zapisu informacji o pliku do bazy danych:', error);
            return res.json({ status: 'error', error: 'Błąd zapisu w bazie danych' });
        }
    });
};

module.exports = uploadFile;
