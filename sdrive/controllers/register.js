const { dbLogins } = require("../routes/db-config");
const bcrypt = require("bcryptjs");

// Funkcja generująca losowy identyfikator składający się z małych i dużych liter, cyfr, oraz znaków # i @
const generateSafeId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@';
    let safeId = '';
    for (let i = 0; i < 16; i++) {
        safeId += chars[Math.floor(Math.random() * chars.length)];
    }
    return safeId;
};

// Funkcja sprawdzająca unikalność safeid_users
const isSafeIdUnique = (safeId) => {
    return new Promise((resolve, reject) => {
        dbLogins.query('SELECT safeid_users FROM users WHERE safeid_users = ?', [safeId], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(false); // SafeId nie jest unikalny
            } else {
                resolve(true); // SafeId jest unikalny
            }
        });
    });
};

const register = async (req, res) => {
    const { email, password: Npassword, firstName, lastName, birthDate } = req.body;

    if (!email || !Npassword || !firstName || !lastName || !birthDate) {
        return res.json({ status: "error", error: "Proszę wypełnić wszystkie pola" });
    } else {
        dbLogins.query('SELECT email_users FROM users WHERE email_users = ?', [email], async (err, result) => {
            if (err) throw err;
            if (result[0]) {
                return res.json({ status: "error", error: "Email już jest w systemie" });
            } else {
                // Hashowanie hasła użytkownika
                const password = await bcrypt.hash(Npassword, 8);

                // Generowanie unikalnego safeId
                let safeId;
                let unique = false;

                // Pętla, która generuje unikalny `safeid_users`, jeśli nie jest unikalny, generuje nowy
                while (!unique) {
                    safeId = generateSafeId();  // Wygeneruj nowy safeId
                    unique = await isSafeIdUnique(safeId);  // Sprawdź, czy jest unikalny
                }

                // Zapisanie nowego użytkownika do bazy danych
                dbLogins.query('INSERT INTO users SET ?', { 
                    email_users: email, 
                    password_users: password,
                    firstname_users: firstName,
                    lastname_users: lastName,
                    dateofbirth_users: birthDate,
                    safeid_users: safeId, // Zapisujemy unikalne safeId
                    type_users: "Normal" // Automatycznie ustawiamy wartość "Normal" dla kolumny type_users
                }, (error, results) => {
                    if (error) throw error;
                    return res.json({ status: "success", success: "Użytkownik został zarejestrowany" });
                });
                
            }
        });
    }
};

module.exports = register;
