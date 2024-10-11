const { dbLogins } = require('../routes/db-config');

const getNotification = (req, res) => {
    const notificationId = req.params.id;
    
    dbLogins.query('SELECT head_notifications, msg_notifications FROM notifications WHERE id_notifications = ?', [notificationId], (err, result) => {
        if (err) return res.json({ status: 'error', error: 'Błąd pobierania powiadomienia' });
        if (result.length === 0) return res.json({ status: 'error', error: 'Powiadomienie nie istnieje' });
        
        res.json({ status: 'success', notification: result[0] });
    });
};

module.exports = { getNotification };
