const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { dbFiles } = require('../routes/db-config');

// Funkcja do wyświetlania zawartości pliku
const showFileContent = (req, res) => {
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
                const filePath = path.join(userDir, filename);  // Plik przechowywany pod zaszyfrowaną nazwą

                if (fs.existsSync(filePath)) {
                    console.log(`Plik istnieje: ${filePath}`);

                    if (fileExtension === '.txt' || fileExtension === '.md') {
                        // Wyświetlanie plików tekstowych i .md
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                console.error('Błąd podczas czytania pliku:', err);
                                return res.status(500).send("Błąd podczas czytania pliku");
                            }
                            res.json({ content: data.replace(/\n/g, '<br>'), originalName });
                        });

                    } else if (fileExtension === '.docx') {
                        // Konwersja pliku .docx na HTML za pomocą mammoth
                        mammoth.convertToHtml({ path: filePath })
                            .then(result => {
                                const htmlFilePath = path.join(userDir, `${path.basename(filename, '.docx')}.html`);
                                fs.writeFileSync(htmlFilePath, result.value);  // Zapisujemy plik .html na serwerze
                                console.log('Plik .docx został pomyślnie skonwertowany i zapisany jako .html.');
                                res.json({ content: result.value, originalName, htmlFilePath });
                            })
                            .catch(err => {
                                console.error('Błąd podczas konwersji pliku .docx:', err);
                                res.status(500).send("Błąd podczas konwersji pliku .docx");
                            });

                    } else {
                        res.status(400).send("Nieobsługiwany typ pliku");
                    }

                } else {
                    console.log(`Plik nie istnieje: ${filePath}`);
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

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

module.exports = {
    showFileContent,
    removeHtmlFile
};
