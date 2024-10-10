const express = require("express");
const { dbLogins } = require("./routes/db-config");
const { dbFiles } = require("./routes/db-config");
const app = express();
const cookie = require("cookie-parser");
const path = require('path');
const PORT = process.env.PORT || 3000;


app.use("/js", express.static(path.join(__dirname, "/public/js")));
app.use("/css", express.static(path.join(__dirname, "/public/css")));
app.use("/data", express.static(path.join(__dirname, "/data"))); // Nowa ścieżka do plików
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Dodaj to, aby obsługiwać przesyłanie formularzy

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth"));

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

//BAZY DANYCH

// UŻYTKOWNICY
dbLogins.connect((err) => {
    if (err) {
        console.error("Błąd połączenia z bazą danych logowania:", err);
    } else {
        console.log("Połączono z bazą danych logowania");
    }
});

// PLIKI
dbFiles.connect((err) => {
    if (err) {
        console.error("Błąd połączenia z bazą danych plików:", err);
    } else {
        console.log("Połączono z bazą danych plików");
    }
});


