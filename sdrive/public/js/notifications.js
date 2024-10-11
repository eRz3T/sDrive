function showNotificationContent(notificationId) {
    fetch(`/api/notification/${notificationId}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const notificationContentLabel = document.getElementById('notificationContentLabel');
            const notificationContent = document.getElementById('notificationContent');
            
            notificationContentLabel.textContent = data.notification.head_notifications;
            notificationContent.innerHTML = `<p>${data.notification.msg_notifications}</p>`;
            
            let notificationModal = new bootstrap.Modal(document.getElementById('notificationContentModal'));
            notificationModal.show();
        } else {
            alert('Błąd podczas wyświetlania powiadomienia');
        }
    })
    .catch(err => {
        console.error('Błąd podczas pobierania powiadomienia:', err);
    });
}