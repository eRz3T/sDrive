const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Konfiguracja Multer do przechowywania plików w odpowiednich folderach
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userEmail = req.user.email_users; // Zalogowany użytkownik
        const userDir = path.join(__dirname, '..', 'data', 'users', userEmail);
        
        // Sprawdź, czy katalog użytkownika istnieje, jeśli nie, to go utwórz
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        cb(null, userDir); // Zapisuj plik w folderze użytkownika
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Zapisz plik z oryginalną nazwą
    }
});

const upload = multer({ storage: storage }).single('file'); // Jednorazowe przesyłanie pliku

// Funkcja obsługująca przesyłanie pliku
const uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ status: 'error', error: 'Błąd przesyłania pliku' });
        }
        return res.json({ status: 'success', success: 'Plik przesłany pomyślnie' });
    });
};

module.exports = uploadFile;
