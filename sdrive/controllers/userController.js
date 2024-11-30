const bcrypt = require('bcryptjs');
const { dbLogins } = require("../routes/db-config");


const updateUser = (req, res) => {
    const userId = req.user.id_users; // ID użytkownika z sesji
    const { firstname, lastname, email, password, dateofbirth } = req.body;

    if (!firstname || !lastname || !email || !password || !dateofbirth) {
        return res.status(400).json({ status: 'error', error: 'Wszystkie pola są wymagane.' });
    }

    const saltRounds = 10;

    // Hashowanie hasła
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Błąd podczas hashowania hasła:', err);
            return res.status(500).json({ status: 'error', error: 'Błąd serwera podczas aktualizacji hasła.' });
        }

        dbLogins.query(
            'UPDATE users SET firstname_users = ?, lastname_users = ?, email_users = ?, password_users = ?, dateofbirth_users = ? WHERE id_users = ?',
            [firstname, lastname, email, hashedPassword, dateofbirth, userId],
            (err) => {
                if (err) {
                    console.error('Błąd podczas aktualizacji danych użytkownika:', err);
                    return res.status(500).json({ status: 'error', error: 'Błąd serwera podczas aktualizacji danych.' });
                }
                res.json({ status: 'success', message: 'Dane użytkownika zostały zaktualizowane.' });
            }
        );
    });
};

module.exports = {
    updateUser,
};
