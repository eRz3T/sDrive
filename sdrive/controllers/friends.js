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

// Zaproszenie do znajomych
const inviteFriend = (req, res) => {
    const inviterId = req.user.id_users; // ID użytkownika, który zaprasza
    const inviterEmail = req.user.email_users; // Email zapraszającego
    const inviterFirstName = req.user.firstname_users; // Imię zapraszającego
    const inviterLastName = req.user.lastname_users; // Nazwisko zapraszającego
    const { friendId } = req.body; // ID zaproszonego użytkownika

    // Najpierw znajdź safeid_users zapraszanego użytkownika
    dbLogins.query('SELECT safeid_users, email_users FROM users WHERE id_users = ?', [friendId], (err, result) => {
        if (err) {
            return res.json({ status: 'error', error: 'Błąd wyszukiwania użytkownika' });
        }

        if (result.length === 0) {
            return res.json({ status: 'error', error: 'Nie znaleziono zapraszanego użytkownika' });
        }

        const safeIdRecipient = result[0].safeid_users;
        const recipientEmail = result[0].email_users;
        
        // Wstaw zaproszenie do znajomych do tabeli `friends`
        dbLogins.query(
            'INSERT INTO friends (id_user_1_friends, id_user_2_friends, status_friends) VALUES (?, ?, "NotActive")',
            [inviterId, friendId],
            (err, result) => {
                if (err) {
                    return res.json({ status: 'error', error: 'Błąd zaproszenia znajomego' });
                }

                // Tworzymy wiadomość dla powiadomienia
                const message = `Użytkownik ${inviterFirstName} ${inviterLastName} (${inviterEmail}) wysłał ci zaproszenie do znajomych`;

                // Wstaw powiadomienie do tabeli `notifications`
                dbLogins.query(
                    'INSERT INTO notifications (user_notifications, head_notifications, msg_notifications, type_notifications, status_notifications, date_notifications) VALUES (?, "Zaproszenie do znajomych", ?, "friend_request", "unread", CURDATE())',
                    [safeIdRecipient, message],
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

module.exports = { searchFriend, inviteFriend };
