function showNotificationContent(notificationId) {
    fetch(`/api/notification/${notificationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const notificationContentLabel = document.getElementById('notificationContentLabel');
                const notificationContent = document.getElementById('notificationContent');
                const friendRequestActions = document.getElementById('friendRequestActions');

                // Ustaw tytuł i treść powiadomienia
                notificationContentLabel.textContent = 'Powiadomienie';
                notificationContent.innerHTML = `<p>${data.notification.msg_notifications}</p>`;

                // Sprawdź, czy to zaproszenie do znajomych
                if (data.notification.type_notifications === 'friend_request') {
                    friendRequestActions.style.display = 'block';
                    document.getElementById('acceptButton').onclick = function() {
                        respondToFriendRequest(data.notification.noteid_notifications, 'accept');
                        updateNotificationStatus(notificationId); // Zmieniamy status po akceptacji
                        location.reload();  // Odświeżenie strony po zaakceptowaniu
                    };
                    document.getElementById('denyButton').onclick = function() {
                        respondToFriendRequest(data.notification.noteid_notifications, 'deny');
                        updateNotificationStatus(notificationId); // Zmieniamy status po odmowie
                        location.reload();  // Odświeżenie strony po odrzuceniu
                    };
                } else {
                    friendRequestActions.style.display = 'none';
                }

                // Pokaż modal z powiadomieniem
                let notificationModal = new bootstrap.Modal(document.getElementById('notificationContentModal'));
                notificationModal.show();

                // Zmieniamy status powiadomienia na "read" po kliknięciu "Zamknij"
                document.querySelector('.btn-secondary').onclick = function() {
                    updateNotificationStatus(notificationId);
                    location.reload();  // Odświeżenie strony po kliknięciu "Zamknij"
                };
            } else {
                alert('Błąd podczas wyświetlania powiadomienia');
            }
        })
        .catch(err => {
            console.error('Błąd podczas pobierania powiadomienia:', err);
        });
}

// Funkcja zmieniająca status powiadomienia na "read"
function updateNotificationStatus(notificationId) {
    fetch(`/api/notification/${notificationId}/read`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log(`Powiadomienie ${notificationId} zostało oznaczone jako przeczytane`);
        } else {
            console.error('Błąd podczas aktualizacji statusu powiadomienia:', data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas aktualizacji statusu powiadomienia:', err);
    });
}

document.getElementById('readNotificationsButton').addEventListener('click', function() {
    fetch('/api/read-notifications')
        .then(response => response.json())
        .then(data => {
            const readNotificationsList = document.getElementById('readNotificationsList');
            readNotificationsList.innerHTML = ''; // Wyczyszczenie starej zawartości

            if (data.status === 'success') {
                const notifications = data.notifications;

                if (notifications.length > 0) {
                    notifications.forEach(notification => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                        
                        const notificationContent = `
                            <div>
                                <strong>${notification.head_notifications}</strong> <br>
                                <small>${new Date(notification.date_notifications).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</small>
                            </div>`;
                        
                        listItem.innerHTML = notificationContent;
                        readNotificationsList.appendChild(listItem);
                    });
                } else {
                    const emptyMessage = document.createElement('li');
                    emptyMessage.classList.add('list-group-item');
                    emptyMessage.textContent = 'Nie masz przeczytanych powiadomień';
                    readNotificationsList.appendChild(emptyMessage);
                }
            } else {
                console.error('Błąd: ', data.error);
            }
        })
        .catch(err => {
            console.error('Błąd podczas pobierania przeczytanych powiadomień:', err);
        });
});
