const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');  // Do generowania zaszyfrowanych nazw plików
const { dbFiles } = require("../routes/db-config");

// Konfiguracja Multer do przechowywania plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const safeId = req.user.safeid_users;  // Pobieramy safeid użytkownika
        const userDir = path.join(__dirname, '..', 'data', 'users', safeId);

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log(`Utworzono katalog dla użytkownika z safeid: ${safeId}`);
        }

        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;
        const cryptedName = crypto.randomBytes(16).toString('hex') + path.extname(originalName);  // Generujemy zaszyfrowaną nazwę
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

    upload(req, res, (err) => {
        if (err) {
            console.error('Błąd podczas przesyłania pliku:', err);
            return res.json({ status: 'error', error: 'Błąd przesyłania pliku' });
        }

        const originalName = req.file.originalname;
        const cryptedName = req.file.filename;
        const fileType = path.extname(originalName).substring(1);  // Typ pliku
        const uploadDate = new Date();  // Aktualny datetime

        // Zapisz dane pliku do bazy danych
        dbFiles.query(
            'INSERT INTO files (originalname_files, cryptedname_files, cryptedowner_files, filetype_files, delete_files, dateofupload_files) VALUES (?, ?, ?, ?, ?, ?)',
            [originalName, cryptedName, safeId, fileType, 0, uploadDate],  // Ustawia delete_files na 0 i wstawia datetime przesyłania
            (err, result) => {
                if (err) {
                    console.error('Błąd zapisu informacji o pliku do bazy danych:', err);
                    return res.json({ status: 'error', error: 'Błąd zapisu w bazie danych' });
                }
                console.log(`Plik ${originalName} został pomyślnie przesłany i zapisany w bazie danych.`);
                return res.json({ status: 'success', success: 'Plik przesłany i zapisany' });
            }
        );
    });
};

module.exports = uploadFile;
