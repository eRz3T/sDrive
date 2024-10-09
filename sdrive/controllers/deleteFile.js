const fs = require('fs');
const path = require('path');

const deleteFile = (req, res) => {
    const userEmail = req.user.email_users;
    const userDir = path.join(__dirname, '..', 'data', 'users', userEmail);
    const filePath = path.join(userDir, req.params.filename);

    // Sprawdź, czy plik istnieje
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.json({ status: 'error', error: 'Błąd podczas usuwania pliku' });
            }
            return res.json({ status: 'success', success: 'Plik został usunięty' });
        });
    } else {
        res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
    }
};

module.exports = deleteFile;
