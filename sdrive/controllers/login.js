const jwt = require("jsonwebtoken");
const { dbLogins } = require("../routes/db-config");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const speakeasy = require("speakeasy");
const path = require("path");
const crypto = require("crypto");

const decryptDirectory = (directoryPath, key) => {
    if (!fs.existsSync(directoryPath)) return;

    const files = fs.readdirSync(directoryPath);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            decryptDirectory(filePath, key);
        } else {
            const encryptedData = fs.readFileSync(filePath);
            const decipher = crypto.createDecipheriv("aes-256-ctr", key, Buffer.alloc(16, 0));
            const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
            fs.writeFileSync(filePath, decryptedData);
        }
    });
};

const login = async (req, res) => {
    const { email, password, totp } = req.body;

    console.log("Odebrane dane logowania:", req.body);

    if (!email || !password || !totp) {
        return res.json({ status: "error", error: "Podaj swój email, hasło i kod Google Authenticator" });
    } else {
        dbLogins.query('SELECT email_users, password_users, safeid_users, id_users, google_auth_secret FROM users WHERE email_users = ?', [email], async (err, result) => {
            if (err) throw err;
            if (!result[0] || !await bcryptjs.compare(password, result[0].password_users)) {
                return res.json({ status: "error", error: "Niepoprawne hasło lub email" });
            } else {
                const safeId = result[0].safeid_users;

                // Weryfikacja Google Authenticator
                const googleAuthSecret = result[0].google_auth_secret;
                if (!googleAuthSecret) {
                    return res.json({ status: "error", error: "Brak skonfigurowanego Google Authenticator dla tego konta" });
                }

                const verified = speakeasy.totp.verify({
                    secret: googleAuthSecret,
                    encoding: "base32",
                    token: totp
                });

                if (!verified) {
                    return res.json({ status: "error", error: "Niepoprawny kod Google Authenticator" });
                }

                // Pobierz klucz szyfrowania z bazy
                dbLogins.query('SELECT code_pass_codes FROM pass_codes WHERE safeid_pass_codes = ?', [safeId], async (err, keyResult) => {
                    if (err) throw err;

                    if (keyResult.length > 0) {
                        const key = Buffer.from(keyResult[0].code_pass_codes, "hex");

                        // Ścieżki do deszyfrowania
                        const userFolder = path.join(__dirname, "..", "data", "users", safeId);
                        const sharesFolder = path.join(__dirname, "..", "data", "shares", safeId);

                        // Deszyfruj katalogi
                        decryptDirectory(userFolder, key);
                        decryptDirectory(sharesFolder, key);
                    }

                    const token = jwt.sign({ id: result[0].id_users }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES
                    });

                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };
                    res.cookie("userRegistered", token, cookieOptions);

                    console.log("Ciasteczko ustawione: ", token);
                    return res.json({ status: "success", redirect: "/home" });
                });
            }
        });
    }
};

module.exports = login;
