const form = document.getElementById('friendSearchForm');
let friendModal;

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const friendEmail = document.getElementById('friendEmail').value;
    console.log('Formularz wyszukiwania znajomego został wysłany. Email:', friendEmail);
    
    fetch(`/api/search-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: friendEmail })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dane z serwera:', data);

        if (data.status === 'success') {
            // Wyświetl informacje w modalnym oknie
            const friendModalLabel = document.getElementById('friendModalLabel');
            const friendEmailInfo = document.getElementById('friendEmailInfo');
            const inviteButton = document.getElementById('inviteButton');

            friendModalLabel.textContent = "Znaleziono użytkownika";
            friendEmailInfo.textContent = `Użytkownik: ${data.user.email_users}`;
            
            inviteButton.onclick = function() {
                inviteFriend(data.user.id_users);
            };

            // Otwórz modal
            friendModal = new bootstrap.Modal(document.getElementById('friendModal'));
            friendModal.show();
        } else {
            console.error(`Błąd wyszukiwania użytkownika: ${data.error}`);
        }
    })
    .catch(err => {
        console.error('Błąd wyszukiwania znajomego:', err);
    });
});

function inviteFriend(friendId) {
    console.log('Wysyłanie zaproszenia do znajomego. ID:', friendId);
    
    fetch(`/api/invite-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId: friendId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Otrzymane dane po zaproszeniu:', data);
        if (data.status === 'success') {
            console.log('Znajomy został zaproszony pomyślnie.');
            friendModal.hide(); // Zamknij modal po zaproszeniu znajomego
        } else {
            console.error(`Błąd zapraszania znajomego: ${data.error}`);
        }
    })
    .catch(err => {
        console.error('Błąd zapraszania znajomego:', err);
    });
}