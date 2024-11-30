const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { dbFiles } = require('../routes/db-config');

// Funkcja do wyświetlania zawartości własnych plików użytkownika
const showUserFileContent = (req, res) => {
    const safeId = req.user.safeid_users;
    const filename = req.params.filename;

    dbFiles.query(
        'SELECT originalname_files, cryptedname_files, filetype_files FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas pobierania pliku z bazy danych:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku z bazy danych' });
            }

            if (result.length > 0) {
                const originalName = result[0].originalname_files;
                const fileExtension = path.extname(originalName).toLowerCase();
                const userDir = path.join(__dirname, '..', 'data', 'users', safeId);
                const filePath = path.join(userDir, filename);

                if (fs.existsSync(filePath)) {
                    handleFileRead(filePath, fileExtension, originalName, res);
                } else {
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

// Funkcja do wyświetlania zawartości plików udostępnionych
const showSharedFileContent = (req, res) => {
    const safeId = req.user.safeid_users;
    const filename = req.params.filename;

    dbFiles.query(
        'SELECT truename_fshare, file_fshare, filetype_fshare FROM fshare WHERE file_fshare = ? AND sharedowner_fshare = ? AND deleted_fshare = 0',
        [filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas pobierania pliku z bazy danych:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku z bazy danych' });
            }

            if (result.length > 0) {
                const originalName = result[0].truename_fshare;
                const fileExtension = path.extname(originalName).toLowerCase();
                const sharedDir = path.join(__dirname, '..', 'data', 'shares', safeId);
                const filePath = path.join(sharedDir, filename);

                if (fs.existsSync(filePath)) {
                    handleFileRead(filePath, fileExtension, originalName, res);
                } else {
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

// Funkcja pomocnicza do odczytu i renderowania plików
function handleFileRead(filePath, fileExtension, originalName, res) {
    if (fileExtension === '.txt' || fileExtension === '.md') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Błąd podczas czytania pliku:', err);
                return res.status(500).send("Błąd podczas czytania pliku");
            }
            res.json({ content: data.replace(/\n/g, '<br>'), originalName });
        });
    } else if (fileExtension === '.docx') {
        mammoth.convertToHtml({ path: filePath })
            .then(result => {
                const htmlFilePath = `${filePath}.html`;
                fs.writeFileSync(htmlFilePath, result.value);
                res.json({ content: result.value, originalName, htmlFilePath });
            })
            .catch(err => {
                console.error('Błąd podczas konwersji pliku .docx:', err);
                res.status(500).send("Błąd podczas konwersji pliku .docx");
            });
    } else {
        res.status(400).send("Nieobsługiwany typ pliku");
    }
}

// Funkcja do usuwania plików HTML
const removeHtmlFile = (req, res) => {
    const { htmlFilePath } = req.body;

    if (fs.existsSync(htmlFilePath)) {
        fs.unlink(htmlFilePath, (err) => {
            if (err) {
                console.error('Błąd podczas usuwania pliku .html:', err);
                return res.json({ status: 'error', error: 'Błąd podczas usuwania pliku .html' });
            }
            console.log(`Plik .html został usunięty: ${htmlFilePath}`);
            res.json({ status: 'success', success: 'Plik .html został usunięty' });
        });
    } else {
        res.status(404).json({ status: 'error', error: 'Plik .html nie istnieje' });
    }
};


const saveFileContent = (req, res) => {
    const safeId = req.user.safeid_users; // ID użytkownika
    const filename = req.params.filename; // Nazwa pliku z URL-a
    const { content } = req.body; // Nowa zawartość pliku przesłana z frontend-u

    const userDir = path.join(__dirname, '..', 'data', 'users', safeId);
    const filePath = path.join(userDir, filename);

    console.log(`Próbuję zapisać zawartość do pliku: ${filePath}`);

    if (fs.existsSync(filePath)) {
        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                console.error('Błąd zapisu pliku:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd zapisu pliku' });
            }
            console.log('Plik zapisany pomyślnie');
            res.json({ status: 'success', success: 'Plik zapisany pomyślnie' });
        });
    } else {
        console.error('Plik nie istnieje:', filePath);
        res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
    }
};

module.exports = { saveFileContent };


const getFileContent = (req, res) => {
    const safeId = req.user.safeid_users;
    const filename = req.params.filename;

    const userDir = path.join(__dirname, '..', 'data', 'users', safeId);
    const filePath = path.join(userDir, filename);

    console.log(`Próbuję pobrać zawartość pliku: ${filePath}`);

    if (fs.existsSync(filePath)) {
        const fileExtension = path.extname(filename).toLowerCase();

        if (fileExtension === '.docx') {
            const mammoth = require('mammoth');
            mammoth.extractRawText({ path: filePath })
                .then(result => {
                    res.json({ status: 'success', content: result.value });
                })
                .catch(err => {
                    console.error('Błąd podczas odczytu pliku .docx:', err);
                    res.status(500).json({ status: 'error', error: 'Błąd odczytu pliku .docx' });
                });
        } else {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Błąd odczytu pliku:', err);
                    return res.status(500).json({ status: 'error', error: 'Błąd odczytu pliku' });
                }
                res.json({ status: 'success', content: data });
            });
        }
    } else {
        console.error('Plik nie istnieje:', filePath);
        res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
    }
};

const renameFile = (req, res) => {
    const safeId = req.user.safeid_users;
    const { fileId } = req.params;
    const { newFileName } = req.body;

    if (!newFileName || typeof newFileName !== 'string' || !newFileName.trim()) {
        return res.status(400).json({ status: 'error', error: 'Nazwa pliku nie może być pusta.' });
    }

    // Sprawdzanie, czy plik istnieje i należy do użytkownika
    dbFiles.query(
        'SELECT originalname_files, cryptedname_files FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [fileId, safeId],
        (err, results) => {
            if (err) {
                console.error('Błąd podczas wyszukiwania pliku:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd serwera.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ status: 'error', error: 'Plik nie istnieje lub brak dostępu.' });
            }

            const currentOriginalName = results[0].originalname_files;
            const cryptedName = results[0].cryptedname_files;
            const userDir = path.join(__dirname, '..', 'data', 'users', safeId);
            const oldFilePath = path.join(userDir, cryptedName);
            const newFilePath = path.join(userDir, cryptedName); // cryptedName pozostaje bez zmian

            // Aktualizacja nazwy w bazie danych
            dbFiles.query(
                'UPDATE files SET originalname_files = ? WHERE cryptedname_files = ? AND cryptedowner_files = ?',
                [newFileName, fileId, safeId],
                (err) => {
                    if (err) {
                        console.error('Błąd podczas aktualizacji nazwy pliku:', err);
                        return res.status(500).json({ status: 'error', error: 'Błąd serwera podczas zmiany nazwy pliku.' });
                    }

                    console.log(`Zmieniono nazwę pliku z "${currentOriginalName}" na "${newFileName}"`);
                    res.json({ status: 'success', message: 'Nazwa pliku została pomyślnie zmieniona.' });
                }
            );
        }
    );
};


module.exports = {
    showUserFileContent,
    showSharedFileContent,
    removeHtmlFile,
    saveFileContent,
    getFileContent,
    renameFile
};