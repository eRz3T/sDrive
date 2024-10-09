const fs = require('fs');
const path = require('path');

const downloadFile = (req, res) => {
    const userEmail = req.user.email_users;
    const userDir = path.join(__dirname, '..', 'data', 'users', userEmail);
    const filePath = path.join(userDir, req.params.filename);

    // Sprawdź, czy plik istnieje
    if (fs.existsSync(filePath)) {
        res.download(filePath); // Pobierz plik
    } else {
        res.status(404).send("Plik nie istnieje");
    }
};

module.exports = downloadFile;
