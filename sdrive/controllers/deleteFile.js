const { dbFiles } = require('../routes/db-config');

const deleteFile = (req, res) => {
    const safeId = req.user.safeid_users;
    const filename = req.params.filename;
    const deleteDate = new Date();  // Aktualny datetime

    // Zmień wartość delete_files na 1 i ustaw datetime w dateofdelete_files
    dbFiles.query(
        'UPDATE files SET delete_files = 1, dateofdelete_files = ? WHERE cryptedname_files = ? AND cryptedowner_files = ?',
        [deleteDate, filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas aktualizacji wpisu w bazie danych:', err);
                return res.json({ status: 'error', error: 'Błąd podczas aktualizacji w bazie danych' });
            }

            if (result.affectedRows === 0) {
                console.log(`Plik ${filename} nie istnieje w bazie danych dla użytkownika ${safeId}.`);
                return res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
            }

            console.log(`Plik ${filename} został oznaczony jako usunięty (delete_files = 1) z datą ${deleteDate}.`);
            return res.json({ status: 'success', success: 'Plik został oznaczony jako usunięty' });
        }
    );
};

const deleteSharedFile = (req, res) => {
    const safeId = req.user.safeid_users;
    const filename = req.params.filename;
    const deleteDate = new Date();  // Aktualny datetime

    // Zmień wartość deleted_fshare na 1 i ustaw datetime w dateofdelete_fshare
    dbFiles.query(
        'UPDATE fshare SET deleted_fshare = 1, dateofdelete_fshare = ? WHERE file_fshare = ? AND sharedowner_fshare = ?',
        [deleteDate, filename, safeId],
        (err, result) => {
            if (err) {
                console.error('Błąd podczas aktualizacji wpisu w tabeli fshare:', err);
                return res.json({ status: 'error', error: 'Błąd podczas aktualizacji w tabeli fshare' });
            }

            if (result.affectedRows === 0) {
                console.log(`Plik ${filename} nie istnieje w tabeli fshare dla użytkownika ${safeId}.`);
                return res.status(404).json({ status: 'error', error: 'Plik nie istnieje' });
            }

            console.log(`Plik ${filename} został oznaczony jako usunięty w tabeli fshare (deleted_fshare = 1) z datą ${deleteDate}.`);
            return res.json({ status: 'success', success: 'Plik udostępniony został oznaczony jako usunięty' });
        }
    );
};

module.exports = {deleteFile, deleteSharedFile};
