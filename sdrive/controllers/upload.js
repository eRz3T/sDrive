const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');  // Do generowania bezpiecznych nazw plików
const { dbFiles } = require("../routes/db-config");

// Konfiguracja Multer do przechowywania plików w odpowiednich folderach
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const safeId = req.user.safeid_users; // Zalogowany użytkownik, teraz pobieramy safeid_users
        const userDir = path.join(__dirname, '..', 'data', 'users', safeId);

        // Sprawdź, czy katalog użytkownika (safeid) istnieje, jeśli nie, to go utwórz
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log(`Utworzono katalog dla użytkownika z safeid: ${safeId}`);
        }

        cb(null, userDir); // Zapisuj plik w folderze użytkownika na podstawie safeid_users
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname;

        // Generowanie bezpiecznej zaszyfrowanej nazwy pliku przy użyciu funkcji crypto
        const cryptedName = crypto.randomBytes(16).toString('hex') + path.extname(originalName); // Bezpieczna nazwa z rozszerzeniem
        console.log(`Przesyłanie pliku: ${originalName} (zaszyfrowana nazwa: ${cryptedName})`);
        cb(null, cryptedName);
    }
});

const upload = multer({ storage: storage }).single('file');

// Funkcja obsługująca przesyłanie pliku i zapisywanie informacji do bazy
const uploadFile = (req, res) => {
    const safeId = req.user.safeid_users;  // Pobieramy safeid_users zamiast emaila
    console.log(`Rozpoczęto przesyłanie pliku przez użytkownika z safeid: ${safeId}`);

    upload(req, res, (err) => {
        if (err) {
            console.error('Błąd podczas przesyłania pliku:', err);
            return res.json({ status: 'error', error: 'Błąd przesyłania pliku' });
        }

        const originalName = req.file.originalname;
        const cryptedName = req.file.filename;

        // Określenie typu pliku na podstawie rozszerzenia
        const fileType = path.extname(originalName).substring(1); // np. 'txt', 'pdf', 'docx'

        // Zapisz dane pliku do bazy danych sdrive_files, teraz z safeid_users w kolumnie cryptedowner_files
        dbFiles.query(
            'INSERT INTO files (originalname_files, cryptedname_files, cryptedowner_files, filetype_files) VALUES (?, ?, ?, ?)',
            [originalName, cryptedName, safeId, fileType],  // Zapisujemy safeId zamiast zaszyfrowanego emaila
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
