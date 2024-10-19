const bcrypt = require("bcryptjs");
const { dbLogins } = require('../routes/db-config');

// Wyszukiwanie użytkownika po emailu
const searchFriend = (req, res) => {
    const { email } = req.body;
    console.log(`Otrzymano żądanie wyszukania znajomego o emailu: ${email}`);

    dbLogins.query('SELECT id_users, email_users FROM users WHERE email_users = ?', [email], (err, result) => {
        if (err) {
            console.error('Błąd podczas wyszukiwania użytkownika w bazie danych:', err);
            return res.json({ status: 'error', error: 'Błąd wyszukiwania' });
        }

        if (result.length === 0) {
            console.log(`Nie znaleziono użytkownika o emailu: ${email}`);
            return res.json({ status: 'error', error: 'Użytkownik nie został znaleziony' });
        }

        console.log(`Znaleziono użytkownika: ${result[0].email_users}, ID: ${result[0].id_users}`);
        res.json({ status: 'success', user: result[0] });
    });
};

// Funkcja pobierająca listę aktywnych znajomych
const getFriends = (req, res) => {
    const userId = req.user.id_users;

    // Pobierz aktywnych znajomych
    dbLogins.query(`
        SELECT users.id_users, users.firstname_users, users.lastname_users, users.email_users
        FROM friends
        JOIN users ON (friends.id_user_1_friends = users.id_users OR friends.id_user_2_friends = users.id_users)
        WHERE (friends.id_user_1_friends = ? OR friends.id_user_2_friends = ?) 
        AND friends.status_friends = "Active" AND users.id_users != ?`,
        [userId, userId, userId], (err, results) => {
            if (err) {
                return res.json({ status: 'error', error: 'Błąd pobierania znajomych' });
            }
            console.log('Pobrano listę znajomych:', results); // Debug
            return res.json({ status: 'success', friends: results });
        }
    );
};


// Funkcja odpowiadająca na zaproszenie do znajomych (akceptacja/odmowa)
const respondToFriendRequest = (req, res) => {
    const { noteId, action } = req.body;
    
    // Ustaw status w zależności od działania
    let newStatus = '';
    if (action === 'accept') {
        newStatus = 'Active';
    } else if (action === 'deny') {
        newStatus = 'Denied';
    } else {
        return res.json({ status: 'error', error: 'Nieprawidłowa akcja' });
    }

    // Znajdź odpowiedni wpis w tabeli friends na podstawie kodu noteId
    dbLogins.query(
        'SELECT * FROM friends WHERE noteid_notifications_friends = ?',
        [noteId],
        (err, result) => {
            if (err) {
                return res.json({ status: 'error', error: 'Błąd podczas szukania zaproszenia' });
            }

            if (result.length === 0) {
                return res.json({ status: 'error', error: 'Nie znaleziono zaproszenia' });
            }

            const friendEntryId = result[0].id_friends;

            // Zaktualizuj status w tabeli friends
            dbLogins.query(
                'UPDATE friends SET status_friends = ? WHERE id_friends = ?',
                [newStatus, friendEntryId],
                (err, updateResult) => {
                    if (err) {
                        return res.json({ status: 'error', error: 'Błąd aktualizacji statusu' });
                    }

                    return res.json({ status: 'success', success: `Zaproszenie zostało ${action === 'accept' ? 'zaakceptowane' : 'odrzucone'}.` });
                }
            );
        }
    );
};

// Funkcja sprawdzająca unikalność kodu
const isNoteIdUnique = (noteId) => {
    return new Promise((resolve, reject) => {
        dbLogins.query('SELECT noteid_notifications_friends FROM friends WHERE noteid_notifications_friends = ?', [noteId], (err, result) => {
            if (err) reject(err);
            if (result.length > 0) {
                resolve(false);  // Kod nie jest unikalny
            } else {
                resolve(true);  // Kod jest unikalny
            }
        });
    });
};

// Funkcja sprawdzająca, czy użytkownicy są już znajomymi
const areUsersAlreadyFriends = (userId1, userId2) => {
    return new Promise((resolve, reject) => {
        dbLogins.query(
            'SELECT * FROM friends WHERE (id_user_1_friends = ? AND id_user_2_friends = ? OR id_user_1_friends = ? AND id_user_2_friends = ?) AND status_friends = "Active"',
            [userId1, userId2, userId2, userId1],
            (err, result) => {
                if (err) reject(err);
                if (result.length > 0) {
                    resolve(true);  // Użytkownicy są już znajomymi
                } else {
                    resolve(false); // Użytkownicy nie są znajomymi
                }
            }
        );
    });
};

// Funkcja wysyłająca zaproszenie do znajomych
const inviteFriend = async (req, res) => {
    const inviterId = req.user.id_users; // ID użytkownika zapraszającego
    const inviterEmail = req.user.email_users; // Email zapraszającego
    const { friendId } = req.body; // ID zaproszonego użytkownika

    // Sprawdź, czy użytkownicy nie są już znajomymi
    const alreadyFriends = await areUsersAlreadyFriends(inviterId, friendId);
    
    if (alreadyFriends) {
        return res.json({ status: 'error', error: 'Użytkownicy są już znajomymi.' });
    }

    // Znajdź safeid_users zapraszanego użytkownika
    dbLogins.query('SELECT safeid_users, email_users FROM users WHERE id_users = ?', [friendId], async (err, result) => {
        if (err) {
            return res.json({ status: 'error', error: 'Błąd wyszukiwania użytkownika' });
        }

        if (result.length === 0) {
            return res.json({ status: 'error', error: 'Nie znaleziono zapraszanego użytkownika' });
        }

        const recipientSafeId = result[0].safeid_users;
        const recipientEmail = result[0].email_users;

        // Pętla generująca unikalny kod bcrypt
        let noteId;
        let unique = false;
        
        while (!unique) {
            noteId = await bcrypt.hash(Date.now().toString(), 10);  // Generowanie kodu
            unique = await isNoteIdUnique(noteId);  // Sprawdzanie unikalności kodu
        }

        // Zapis zaproszenia do tabeli `friends`
        dbLogins.query(
            'INSERT INTO friends (id_user_1_friends, id_user_2_friends, status_friends, noteid_notifications_friends) VALUES (?, ?, "NotActive", ?)',
            [inviterId, friendId, noteId],
            (err, result) => {
                if (err) {
                    return res.json({ status: 'error', error: 'Błąd zaproszenia znajomego' });
                }

                // Tworzymy wiadomość dla powiadomienia
                const message = `Użytkownik ${req.user.firstname_users} ${req.user.lastname_users} (${inviterEmail}) wysłał ci zaproszenie do znajomych.`;

                // Zapis powiadomienia do tabeli `notifications`
                dbLogins.query(
                    'INSERT INTO notifications (user_notifications, head_notifications, msg_notifications, type_notifications, status_notifications, date_notifications, dispatcher_notifications, noteid_notifications) VALUES (?, "Zaproszenie do znajomych", ?, "friend_request", "unread", CURDATE(), ?, ?)',
                    [recipientSafeId, message, inviterEmail, noteId],
                    (err, result) => {
                        if (err) {
                            return res.json({ status: 'error', error: 'Błąd wysyłania powiadomienia' });
                        }
                        res.json({ status: 'success', success: 'Znajomy został zaproszony, a powiadomienie wysłane.' });
                    }
                );
            }
        );
    });
};

const removeFriend = (req, res) => {
    const { friendId } = req.body;
    const userEmail = req.user.email_users;  // Email użytkownika

    console.log('Próba usunięcia znajomego o ID:', friendId); // Debug

    // Znajdź ID użytkownika na podstawie emaila
    dbLogins.query('SELECT id_users FROM users WHERE email_users = ?', [userEmail], (err, result) => {
        if (err) {
            console.error('Błąd przy wyszukiwaniu użytkownika na podstawie emaila:', err);
            return res.json({ status: 'error', error: 'Błąd podczas wyszukiwania użytkownika.' });
        }

        if (result.length === 0) {
            return res.json({ status: 'error', error: 'Nie znaleziono użytkownika.' });
        }

        const userId = result[0].id_users;
        console.log('Zalogowany użytkownik ID:', userId); // Debug

        // Sprawdź, czy istnieje znajomość ze statusem "Active"
        dbLogins.query(`
            SELECT * FROM friends
            WHERE (id_user_1_friends = ? AND id_user_2_friends = ?) OR (id_user_1_friends = ? AND id_user_2_friends = ?) 
            AND status_friends = "Active"`,
            [userId, friendId, friendId, userId], (err, result) => {
                if (err) {
                    console.error('Błąd zapytania SQL przy sprawdzaniu znajomości:', err); // Debug
                    return res.json({ status: 'error', error: 'Błąd podczas sprawdzania znajomości.' });
                }

                console.log('Wynik zapytania sprawdzającego:', result); // Debug

                if (result.length === 0) {
                    return res.json({ status: 'error', error: 'Nie znaleziono aktywnej znajomości do usunięcia.' });
                }

                // Zaktualizuj status znajomości na "Removed"
                dbLogins.query(`
                    UPDATE friends
                    SET status_friends = "Removed"
                    WHERE (id_user_1_friends = ? AND id_user_2_friends = ?) OR (id_user_1_friends = ? AND id_user_2_friends = ?)
                    AND status_friends = "Active"`,
                    [userId, friendId, friendId, userId], (err, updateResult) => {
                        if (err) {
                            console.error('Błąd zapytania SQL przy usuwaniu znajomego:', err); // Debug
                            return res.json({ status: 'error', error: 'Błąd podczas usuwania znajomego.' });
                        }

                        console.log('Wynik zapytania SQL:', updateResult); // Debug

                        if (updateResult.affectedRows === 0) {
                            console.warn('Nie znaleziono aktywnej znajomości do usunięcia.'); // Debug
                            return res.json({ status: 'error', error: 'Nie znaleziono aktywnej znajomości.' });
                        }

                        console.log('Znajomy został pomyślnie usunięty.'); // Debug
                        return res.json({ status: 'success', success: 'Znajomy został usunięty.' });
                    }
                );
            }
        );
    });
};



module.exports = { searchFriend, inviteFriend, respondToFriendRequest, getFriends, removeFriend };
