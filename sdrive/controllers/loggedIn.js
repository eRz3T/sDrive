const db = require("../routes/db-config")
const jwt = require("jsonwebtoken")
const loggedIn = (req, res, next) => {
    if (!req.cookies.userRegistered) return next();
    try {
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
        dbquerry('SELECT * FROM users WHERE id = ?', [decoded.id], (err,result) =>{
            req.user = result[0];
            return next();
        })
    } catch (err) {
        if (err) return next()
    }
}
module.exports = loggedIn;