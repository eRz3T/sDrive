function showNotificationContent(notificationId) {
    console.log(`Wywołano showNotificationContent z notificationId=${notificationId}`); // Debugowanie

    fetch(`/api/notification/${notificationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const notificationContentLabel = document.getElementById('notificationContentLabel');
                const notificationContent = document.getElementById('notificationContent');
                const friendRequestActions = document.getElementById('friendRequestActions');

                notificationContentLabel.textContent = 'Powiadomienie';
                notificationContent.innerHTML = `<p>${data.notification.msg_notifications}</p>`;

                if (data.notification.type_notifications === 'friend_request') {
                    friendRequestActions.style.display = 'block';
                    document.getElementById('acceptButton').onclick = function() {
                        console.log('Kliknięto Akceptuj'); // Debugowanie
                        respondToFriendRequest(data.notification.noteid_notifications, 'accept');
                    };
                    document.getElementById('denyButton').onclick = function() {
                        console.log('Kliknięto Odmów'); // Debugowanie
                        respondToFriendRequest(data.notification.noteid_notifications, 'deny');
                    };
                } else {
                    friendRequestActions.style.display = 'none';
                }

                const notificationModal = new bootstrap.Modal(document.getElementById('notificationContentModal'));
                notificationModal.show();

                // Ustawienie obsługi kliknięcia przycisku "Zamknij"
                document.querySelector('.btn-secondary').onclick = function() {
                    updateNotificationStatus(notificationId);
                    notificationModal.hide();
                    setTimeout(() => location.reload(), 100); // Odświeżenie po zamknięciu modala
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
                        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
                        
                        const notificationContent = `
                            <div>
                                <strong>${notification.head_notifications}</strong><br>
                                <small>${new Date(notification.date_notifications).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</small>
                            </div>
                            <div class="text-start ms-auto" style="max-width: 60%;">
                                <p>${notification.msg_notifications}</p> <!-- Treść wiadomości -->
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


