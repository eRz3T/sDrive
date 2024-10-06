const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req,res) => {
    const { email, password: Npassword } = req.body
    if (!email || !Npassword) return res.json({status: "error", error: "Podaj swój email i hasło"});
    else {
        db.querry('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
            if(err) throw err;
            if(result[0]) return res.json ({ status: "error", error: "Email już jest w systemie"})
            else {
                const password = bcrypt.hash(Npassword, 8);
                db.querry ('INSERT INTO users SET ?', {email: email, password: password}, (error, results) => {
                    if (error) throw error;
                    return res.json({status: "success", success: "Użytkownik został zarejestrowany"})
                })
            }
        })
    }
}
module.exports = register;