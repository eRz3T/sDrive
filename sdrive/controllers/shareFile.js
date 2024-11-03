const { dbFiles } = require('../routes/db-config');
const path = require('path');
const fs = require('fs');

// Funkcja do udostępnienia oryginalnego pliku użytkownika
const shareFile = (req, res) => {
    const { cryptedname_files, sharedFriendSafeId } = req.body;
    const originalOwnerSafeId = req.user.safeid_users;
    const dateShared = new Date();

    console.log("Twoje pliki: Rozpoczęto udostępnianie oryginalnego pliku:", { cryptedname_files, sharedFriendSafeId, originalOwnerSafeId });

    // Pobieranie informacji o pliku z tabeli `files`
    dbFiles.query(
        'SELECT id_files, originalname_files, filetype_files, cryptedowner_files FROM files WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [cryptedname_files, originalOwnerSafeId],
        (err, result) => {
            if (err || result.length === 0) {
                console.error('Błąd podczas wyszukiwania pliku w bazie `files`:', err);
                return res.status(500).json({ status: 'error', error: 'Nie znaleziono pliku lub błąd bazy danych.' });
            }

            const { id_files, originalname_files, filetype_files, cryptedowner_files } = result[0];
            console.log("Znaleziono plik w tabeli `files`:", { id_files, originalname_files, filetype_files });

            // Wstawianie do tabeli `fshare`
            dbFiles.query(
                `INSERT INTO fshare 
                (originalowner_fshare, sharedowner_fshare, file_fshare, date_fshare, id_files_fshare, filetype_fshare, truename_fshare, deleted_fshare) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
                [cryptedowner_files, sharedFriendSafeId, cryptedname_files, dateShared, id_files, filetype_files, originalname_files],
                (err) => {
                    if (err) {
                        console.error('Błąd podczas dodawania wpisu do tabeli `fshare`:', err);
                        return res.status(500).json({ status: 'error', error: 'Błąd podczas dodawania wpisu do bazy danych.' });
                    }

                    const originalPath = path.join(__dirname, '..', 'data', 'users', originalOwnerSafeId, cryptedname_files);
                    const sharedPath = path.join(__dirname, '..', 'data', 'shares', sharedFriendSafeId);
                    const destinationPath = path.join(sharedPath, cryptedname_files);

                    if (!fs.existsSync(sharedPath)) {
                        fs.mkdirSync(sharedPath, { recursive: true });
                        console.log(`Utworzono folder udostępniania dla użytkownika z safeid: ${sharedFriendSafeId}`);
                    }

                    fs.copyFile(originalPath, destinationPath, (err) => {
                        if (err) {
                            console.error('Błąd podczas kopiowania pliku:', err);
                            return res.status(500).json({ status: 'error', error: 'Błąd podczas kopiowania pliku.' });
                        }

                        console.log(`Plik ${cryptedname_files} został pomyślnie udostępniony użytkownikowi ${sharedFriendSafeId}`);
                        return res.json({ status: 'success', success: 'Plik został pomyślnie udostępniony' });
                    });
                }
            );
        }
    );
};

// Funkcja do udostępnienia pliku, który został wcześniej udostępniony użytkownikowi
const shareSharedFile = (req, res) => {
    const { fileToShare, receiverSafeId } = req.body;
    const senderSafeId = req.user.safeid_users;  // Safe ID obecnego użytkownika (aktualnego posiadacza pliku)
    const dateShare = new Date();
    const timestamp = dateShare.toISOString().replace(/[-T:.Z]/g, '');
    const sharedDir = path.join(__dirname, '..', 'data', 'shares', receiverSafeId);

    console.log("Udostępnione: Rozpoczęto udostępnianie udostępnionego pliku:", { fileToShare, receiverSafeId, senderSafeId });

    // Pobierz dane o pliku w tabeli `fshare`
    dbFiles.query(
        'SELECT truename_fshare, file_fshare, filetype_fshare, id_files_fshare FROM fshare WHERE file_fshare = ? AND sharedowner_fshare = ? AND deleted_fshare = 0',
        [fileToShare, senderSafeId],
        (err, result) => {
            if (err || result.length === 0) {
                console.error("Błąd podczas wyszukiwania pliku w tabeli `fshare`:", err);
                return res.status(500).json({ status: 'error', error: 'Błąd pobierania pliku lub plik nie istnieje.' });
            }

            const { truename_fshare: truename, file_fshare: fileShare, filetype_fshare: filetype, id_files_fshare: idFiles } = result[0];
            const newFileShare = `${fileShare}_${timestamp}`;
            const newFilePath = path.join(sharedDir, newFileShare);
            const originalFilePath = path.join(__dirname, '..', 'data', 'shares', senderSafeId, fileShare);

            console.log("Tworzenie nowej nazwy pliku:", newFileShare);
            console.log("Ścieżka oryginalnego pliku:", originalFilePath);
            console.log("Ścieżka nowego pliku:", newFilePath);

            if (!fs.existsSync(sharedDir)) {
                fs.mkdirSync(sharedDir, { recursive: true });
                console.log("Utworzono katalog:", sharedDir);
            }

            if (fs.existsSync(originalFilePath)) {
                fs.copyFile(originalFilePath, newFilePath, (err) => {
                    if (err) {
                        console.error("Błąd podczas kopiowania pliku:", err);
                        return res.status(500).json({ status: 'error', error: 'Błąd kopiowania pliku' });
                    }

                    console.log("Plik został skopiowany do:", newFilePath);

                    // Dodajemy nowy rekord w tabeli `fshare` z nowym odbiorcą
                    dbFiles.query(
                        'INSERT INTO fshare (originalowner_fshare, sharedowner_fshare, file_fshare, date_fshare, id_files_fshare, filetype_fshare, truename_fshare, deleted_fshare) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
                        [senderSafeId, receiverSafeId, newFileShare, dateShare, idFiles, filetype, truename],
                        (err) => {
                            if (err) {
                                console.error("Błąd przy dodawaniu rekordu do tabeli `fshare`:", err);
                                return res.status(500).json({ status: 'error', error: 'Błąd udostępniania pliku' });
                            }

                            console.log("Rekord został pomyślnie dodany do tabeli `fshare`.");
                            res.json({ status: 'success', success: 'Plik udostępniony pomyślnie' });
                        }
                    );
                });
            } else {
                console.error("Plik źródłowy nie istnieje:", originalFilePath);
                res.status(404).json({ status: 'error', error: 'Plik źródłowy nie istnieje' });
            }
        }
    );
};

module.exports = { shareFile, shareSharedFile };
