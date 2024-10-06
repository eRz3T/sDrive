const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");
const bcryptjs = require("bcryptjs");

const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Odebrane dane logowania:", req.body);

    if (!email || !password) {
        return res.json({ status: "error", error: "Podaj swój email i hasło" });
    } else {
        db.query('SELECT email_users, password_users, id_users FROM users WHERE email_users = ?', [email], async (err, result) => {
            if (err) throw err;
            if (!result[0] || !await bcryptjs.compare(password, result[0].password_users)) {
                return res.json({ status: "error", error: "Niepoprawne hasło lub email" });
            } else {
                const token = jwt.sign({ id: result[0].id_users }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                });

                const cookieOptions = {
                    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };
                res.cookie("userRegistered", token, cookieOptions);

                console.log("Ciasteczko ustawione: ", token);  // Debugowanie

                return res.json({ status: "success", redirect: "/home" });
            }
        });
    }
};

module.exports = login;
