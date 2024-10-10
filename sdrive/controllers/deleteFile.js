const fs = require('fs');
const path = require('path');
const { dbFiles } = require('../routes/db-config');  // Połączenie z bazą danych

const deleteFile = (req, res) => {
    const safeId = req.user.safeid_users;  // Pobierz safeid użytkownika (cryptedowner_files)
    const filename = req.params.filename;  // Pobierz zaszyfrowaną nazwę pliku (cryptedname_files)
    const userDir = path.join(__dirname, '..', 'data', 'users', safeId);  // Folder użytkownika
    const filePath = path.join(userDir, filename);  // Ścieżka do pliku

    // Sprawdź, czy plik istnieje w systemie plików
    if (fs.existsSync(filePath)) {
        // Usuń plik z systemu plików
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Błąd podczas usuwania pliku:', err);
                return res.json({ status: 'error', error: 'Błąd podczas usuwania pliku' });
            }

            // Usuń wpis z bazy danych na podstawie cryptedname_files i cryptedowner_files
            dbFiles.query(
                'DELETE FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
                [filename, safeId],
                (err, result) => {
                    if (err) {
                        console.error('Błąd podczas usuwania wpisu z bazy danych:', err);
                        return res.json({ status: 'error', error: 'Błąd podczas usuwania z bazy danych' });
                    }

                    console.log(`Plik ${filename} został pomyślnie usunięty z systemu plików i bazy danych.`);
                    return res.json({ status: 'success', success: 'Plik został usunięty' });
                }
            );
        });
    } else {
        console.log(`Plik ${filename} nie istnieje w ścieżce ${filePath}`);
        res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
    }
};

module.exports = deleteFile;
