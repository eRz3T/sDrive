const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { email, password: Npassword } = req.body;

    console.log("Odebrane dane:", req.body);

    if (!email || !Npassword) {
        return res.json({ status: "error", error: "Podaj swój email i hasło" });
    } else {
        db.query('SELECT email_users FROM users WHERE email_users = ?', [email], async (err, result) => {
            if (err) throw err;
            if (result[0]) {
                return res.json({ status: "error", error: "Email już jest w systemie" });
            } else {
                const password = await bcrypt.hash(Npassword, 8);
                db.query('INSERT INTO users SET ?', { email_users: email, password_users: password }, (error, results) => {
                    if (error) throw error;
                    return res.json({ status: "success", success: "Użytkownik został zarejestrowany" });
                });
            }
        });
    }
};

module.exports = register;
