const fs = require('fs');
const path = require('path');
const { dbFiles } = require('../routes/db-config');  // Połączenie z bazą danych

const downloadFile = (req, res) => {
    const safeId = req.user.safeid_users;  // Pobierz safeid użytkownika (cryptedowner_files)
    const filename = req.params.filename;  // Pobieramy zaszyfrowaną nazwę pliku (cryptedname_files)

    // Pobierz plik z bazy danych na podstawie cryptedname_files i cryptedowner_files
    dbFiles.query(
        'SELECT originalname_files, cryptedname_files FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas pobierania pliku z bazy danych:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku' });
            }
            
            if (result.length > 0) {
                const originalName = result[0].originalname_files;
                const cryptedName = result[0].cryptedname_files;
                const userDir = path.join(__dirname, '..', 'data', 'users', safeId);  // Folder użytkownika
                const filePath = path.join(userDir, cryptedName);  // Ścieżka do pliku na podstawie cryptedname_files

                // Sprawdź, czy plik istnieje
                if (fs.existsSync(filePath)) {
                    res.download(filePath, originalName);  // Pobierz plik z oryginalną nazwą
                } else {
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

module.exports = downloadFile;
