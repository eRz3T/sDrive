const fs = require('fs');
const path = require('path');
const { dbFiles } = require('../routes/db-config');
const archiver = require('archiver');

const downloadFile = (req, res) => {
    const safeId = req.user.safeid_users;  // Pobierz safeid użytkownika (cryptedowner_files)
    const filename = req.params.filename;  // Pobieramy zaszyfrowaną nazwę pliku (cryptedname_files)

    // Pobierz plik z bazy danych na podstawie cryptedname_files i cryptedowner_files
    dbFiles.query(
        'SELECT originalname_files, cryptedname_files FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas pobierania pliku z bazy danych:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku' });
            }
            
            if (result.length > 0) {
                const originalName = result[0].originalname_files;
                const cryptedName = result[0].cryptedname_files;
                const userDir = path.join(__dirname, '..', 'data', 'users', safeId);  // Folder użytkownika
                const filePath = path.join(userDir, cryptedName);  // Ścieżka do pliku na podstawie cryptedname_files

                // Sprawdź, czy plik istnieje
                if (fs.existsSync(filePath)) {
                    res.download(filePath, originalName);  // Pobierz plik z oryginalną nazwą
                } else {
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

const downloadSharedFile = (req, res) => {
    const safeId = req.user.safeid_users;  // Pobierz safeid użytkownika (odbiorcy pliku)
    const filename = req.params.filename;  // Pobieramy zaszyfrowaną nazwę pliku (file_fshare)

    // Pobierz dane pliku z tabeli `fshare` na podstawie file_fshare i sharedowner_fshare
    dbFiles.query(
        'SELECT truename_fshare, file_fshare FROM fshare WHERE file_fshare = ? AND sharedowner_fshare = ? AND deleted_fshare = 0',
        [filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas pobierania pliku udostępnionego z bazy danych:', err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku' });
            }
            
            if (result.length > 0) {
                const originalName = result[0].truename_fshare;
                const cryptedName = result[0].file_fshare;
                const sharedDir = path.join(__dirname, '..', 'data', 'shares', safeId);  // Folder udostępnionych plików dla użytkownika
                const filePath = path.join(sharedDir, cryptedName);  // Ścieżka do pliku

                // Sprawdź, czy plik istnieje
                if (fs.existsSync(filePath)) {
                    res.download(filePath, originalName);  // Pobierz plik z oryginalną nazwą
                } else {
                    res.status(404).send("Plik nie istnieje");
                }
            } else {
                res.status(404).send("Plik nie istnieje w bazie danych");
            }
        }
    );
};

const downloadStorage = async (req, res) => {
    const { storageId } = req.params;
    const safeId = req.user.safeid_users;

    console.log(`DEBUG: Rozpoczęcie pobierania magazynu. storageId: ${storageId}, safeId: ${safeId}`);

    const storagePath = path.join(__dirname, '..', 'data', 'storages', safeId, storageId);
    const tempDir = path.join(__dirname, '..', 'temp', storageId);

    if (!fs.existsSync(storagePath)) {
        console.error(`DEBUG: Ścieżka magazynu nie istnieje: ${storagePath}`);
        return res.status(404).json({ status: 'error', error: 'Magazyn nie istnieje.' });
    }

    if (!fs.existsSync(tempDir)) {
        console.log(`DEBUG: Tworzenie katalogu temp: ${tempDir}`);
        fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
        // Pobierz informacje o plikach w magazynie
        const files = await new Promise((resolve, reject) => {
            dbFiles.query(
                'SELECT f.originalname_files, f.cryptedname_files FROM files f JOIN storages_files sf ON f.id_files = sf.id_files WHERE sf.id_storages = ? AND sf.active_storages_files = 1',
                [storageId],
                (err, results) => {
                    if (err) {
                        console.error(`DEBUG: Błąd pobierania plików z bazy danych: ${err.message}`);
                        return reject(err);
                    }
                    resolve(results);
                }
            );
        });

        if (files.length === 0) {
            console.error('DEBUG: Brak plików w magazynie.');
            return res.status(404).json({ status: 'error', error: 'Brak plików w magazynie.' });
        }

        console.log(`DEBUG: Liczba znalezionych plików: ${files.length}`);

        // Kopiowanie plików do folderu tymczasowego z odpowiednimi nazwami
        for (const file of files) {
            const sourcePath = path.join(storagePath, file.cryptedname_files);
            const destPath = path.join(tempDir, file.originalname_files);

            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`DEBUG: Skopiowano plik z magazynu: ${file.cryptedname_files} -> ${file.originalname_files}`);
            } else {
                console.warn(`DEBUG: Plik nie istnieje w magazynie: ${sourcePath}`);
            }
        }

        console.log('DEBUG: Wszystkie pliki zostały skopiowane do katalogu tymczasowego.');

        // Tworzenie archiwum ZIP
        const zipFileName = `${storageId}.zip`;
        const zipFilePath = path.join(__dirname, '..', 'temp', zipFileName);

        console.log(`DEBUG: Tworzenie archiwum ZIP: ${zipFilePath}`);
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`DEBUG: Archiwum utworzone. Rozmiar: ${archive.pointer()} bajtów.`);
            res.download(zipFilePath, `${storageId}.zip`, (err) => {
                if (err) {
                    console.error(`DEBUG: Błąd podczas wysyłania pliku ZIP: ${err.message}`);
                }
                fs.unlink(zipFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error(`DEBUG: Błąd podczas usuwania pliku tymczasowego ZIP: ${unlinkErr.message}`);
                    console.log('DEBUG: Plik tymczasowy ZIP usunięty.');
                });

                // Czyszczenie katalogu tymczasowego
                fs.rm(tempDir, { recursive: true, force: true }, (err) => {
                    if (err) {
                        console.error(`DEBUG: Błąd podczas czyszczenia katalogu tymczasowego: ${err.message}`);
                    } else {
                        console.log(`DEBUG: Katalog tymczasowy został wyczyszczony: ${tempDir}`);
                    }
                });
            });
        });

        output.on('error', (err) => {
            console.error(`DEBUG: Błąd tworzenia archiwum ZIP: ${err.message}`);
            res.status(500).json({ status: 'error', error: 'Błąd tworzenia archiwum magazynu.' });
        });

        archive.pipe(output);
        archive.directory(tempDir, false);
        await archive.finalize();
        console.log('DEBUG: Proces tworzenia archiwum zakończony.');
    } catch (err) {
        console.error(`DEBUG: Błąd podczas przetwarzania magazynu: ${err.message}`);
        res.status(500).json({ status: 'error', error: 'Wystąpił błąd podczas przetwarzania magazynu.' });
    }
};



module.exports = { downloadFile, downloadSharedFile, downloadStorage };
