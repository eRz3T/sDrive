const { dbLogins } = require("../routes/db-config");
const jwt = require("jsonwebtoken");

const loggedIn = (req, res, next) => {
    if (!req.cookies.userRegistered) {
        console.log("Brak ciasteczka JWT");
        return next();
    }
    
    try {
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        console.log("Odczytany token JWT:", decoded);  // Dodaj logowanie

        dbLogins.query('SELECT * FROM users WHERE id_users = ?', [decoded.id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                req.user = result[0];
                console.log("Użytkownik rozpoznany:", req.user);  // Dodaj logowanie
                return next();
            } else {
                console.log("Użytkownik nie został znaleziony w bazie");
                return next();
            }
        });
    } catch (err) {
        console.log("Błąd JWT:", err);
        return next();
    }
};

module.exports = loggedIn;
