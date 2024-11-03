const bcrypt = require('bcryptjs');
const { dbLogins } = require('../routes/db-config');

const startNewConversation = async (req, res) => {
    const { recipientSafeId, initialMessage } = req.body;
    const senderSafeId = req.user?.safeid_users;

    if (!senderSafeId || !recipientSafeId) {
        console.error("Brakujące dane: senderSafeId lub recipientSafeId są null.");
        return res.status(400).json({ status: 'error', error: 'Błędne dane użytkownika.' });
    }

    try {
        // Generowanie unikalnego kodu konwersacji
        const codemsg = await bcrypt.hash(Date.now().toString(), 10);

        // Tworzenie nowej konwersacji
        dbLogins.query(
            'INSERT INTO conversations (ppl1_conversations, ppl2_conversations, codemsg_conversations) VALUES (?, ?, ?)',
            [senderSafeId, recipientSafeId, codemsg],
            (err, result) => {
                if (err) {
                    console.error("Błąd podczas dodawania konwersacji:", err);
                    return res.status(500).json({ status: 'error', error: 'Błąd przy tworzeniu konwersacji.' });
                }

                // Wstawienie wiadomości do nowo utworzonej konwersacji
                dbLogins.query(
                    'INSERT INTO messages (reciver_messages, sender_messages, content_messages, date_messages, codemsg_messages) VALUES (?, ?, ?, NOW(), ?)',
                    [recipientSafeId, senderSafeId, initialMessage, codemsg],
                    (err) => {
                        if (err) {
                            console.error("Błąd podczas dodawania wiadomości:", err);
                            return res.status(500).json({ status: 'error', error: 'Błąd przy dodawaniu wiadomości.' });
                        }
                        res.json({ status: 'success', message: 'Konwersacja rozpoczęta i wiadomość wysłana.' });
                    }
                );
            }
        );
    } catch (error) {
        console.error("Błąd podczas rozpoczynania konwersacji:", error);
        res.status(500).json({ status: 'error', error: 'Wystąpił błąd podczas rozpoczynania konwersacji.' });
    }
};


// Funkcja do pobierania listy konwersacji
const getConversations = (req, res) => {
    const safeId = req.user.safeid_users;

    dbLogins.query(
        `SELECT conversations.id_conversations, conversations.ppl1_conversations, conversations.ppl2_conversations, conversations.codemsg_conversations, users.firstname_users, users.lastname_users
        FROM conversations
        JOIN users ON (conversations.ppl1_conversations = users.safeid_users OR conversations.ppl2_conversations = users.safeid_users)
        WHERE (conversations.ppl1_conversations = ? OR conversations.ppl2_conversations = ?)
        AND users.safeid_users != ?`,
        [safeId, safeId, safeId],
        (err, results) => {
            if (err) {
                console.error("Błąd podczas pobierania konwersacji:", err);
                return res.status(500).json({ status: "error", error: "Błąd pobierania konwersacji" });
            }

            const conversations = results.map(row => ({
                id: row.id_conversations,
                partnerName: `${row.firstname_users} ${row.lastname_users}`,
                codemsg: row.codemsg_conversations  // Dodaj codemsg do każdego obiektu konwersacji
            }));

            res.json({ status: "success", conversations });
        }
    );
};


const getMessages = (req, res) => {
    const { codemsg } = req.query;

    console.log("Otrzymany codemsg:", codemsg);  // Dodanie logu

    dbLogins.query(
        `SELECT messages.sender_messages, messages.content_messages, messages.date_messages, users.firstname_users, users.lastname_users
         FROM messages
         JOIN users ON messages.sender_messages = users.safeid_users
         WHERE messages.codemsg_messages = ?
         ORDER BY messages.date_messages ASC`,
        [codemsg],
        (err, results) => {
            if (err) {
                console.error("Błąd podczas pobierania wiadomości:", err);
                return res.status(500).json({ status: "error", error: "Błąd podczas pobierania wiadomości" });
            }

            console.log("Pobrane wiadomości z bazy danych:", results);  // Dodanie logu

            if (results.length === 0) {
                console.log("Brak wiadomości dla podanego codemsg.");  // Log gdy brak wyników
            }

            const messages = results.map(row => ({
                senderName: `${row.firstname_users} ${row.lastname_users}`,
                content: row.content_messages,
                date: row.date_messages
            }));

            res.json({ status: "success", messages });
        }
    );
};


const sendMessage = (req, res) => {
    const { codemsg, content } = req.body;
    const senderSafeId = req.user.safeid_users;
    const date = new Date();

    if (!codemsg || !content) {
        return res.status(400).json({ status: "error", error: "Brakujące dane w żądaniu." });
    }

    // Sprawdzenie, czy zalogowany użytkownik jest `ppl1_conversations` czy `ppl2_conversations`
    dbLogins.query(
        `SELECT ppl1_conversations, ppl2_conversations FROM conversations WHERE codemsg_conversations = ?`,
        [codemsg],
        (err, result) => {
            if (err || result.length === 0) {
                console.error("Błąd podczas pobierania uczestników konwersacji:", err);
                return res.status(500).json({ status: "error", error: "Błąd podczas wysyłania wiadomości." });
            }

            const { ppl1_conversations, ppl2_conversations } = result[0];

            let receiverSafeId;

            // Ustalanie odbiorcy na podstawie `safeid` zalogowanego użytkownika
            if (senderSafeId === ppl1_conversations) {
                receiverSafeId = ppl2_conversations;
            } else if (senderSafeId === ppl2_conversations) {
                receiverSafeId = ppl1_conversations;
            } else {
                return res.status(400).json({ status: "error", error: "Użytkownik nie jest uczestnikiem tej konwersacji." });
            }

            // Wstawianie wiadomości z ustalonym odbiorcą i nadawcą
            dbLogins.query(
                `INSERT INTO messages (reciver_messages, sender_messages, content_messages, date_messages, codemsg_messages)
                 VALUES (?, ?, ?, ?, ?)`,
                [receiverSafeId, senderSafeId, content, date, codemsg],
                (err) => {
                    if (err) {
                        console.error("Błąd podczas wysyłania wiadomości:", err);
                        return res.status(500).json({ status: "error", error: "Błąd podczas wysyłania wiadomości" });
                    }
                    res.json({ status: "success", success: "Wiadomość została wysłana" });
                }
            );
        }
    );
};





module.exports = { startNewConversation, getConversations, getMessages, sendMessage };
