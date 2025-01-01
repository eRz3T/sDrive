const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { dbLogins } = require('../routes/db-config');

const generateKey = () => crypto.randomBytes(32);

const encryptDirectory = (directoryPath, key) => {
    if (!fs.existsSync(directoryPath)) return;

    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            encryptDirectory(filePath, key);
        } else {
            const fileData = fs.readFileSync(filePath);
            const cipher = crypto.createCipheriv("aes-256-ctr", key, Buffer.alloc(16, 0));
            const encryptedData = Buffer.concat([cipher.update(fileData), cipher.final()]);
            fs.writeFileSync(filePath, encryptedData);
        }
    });
};

const logout = (req, res) => {
    const safeId = req.user.safeid_users; // Zakładamy, że użytkownik jest dostępny w req.user

    // Generuj nowy klucz szyfrowania
    const newKey = generateKey();

    // Zaktualizuj klucz w bazie danych
    dbLogins.query('REPLACE INTO pass_codes (safeid_pass_codes, code_pass_codes) VALUES (?, ?)', [safeId, newKey.toString("hex")], (err) => {
        if (err) throw err;

        // Ścieżki do szyfrowania
        const userFolder = path.join(__dirname, "..", "data", "users", safeId);
        const sharesFolder = path.join(__dirname, "..", "data", "shares", safeId);

        // Szyfruj katalogi
        encryptDirectory(userFolder, newKey);
        encryptDirectory(sharesFolder, newKey);

        res.clearCookie("userRegistered");
        res.redirect("/");
    });
};

module.exports = logout;
