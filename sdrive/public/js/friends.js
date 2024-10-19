const form = document.getElementById('friendSearchForm');
let friendModal;

// Nasłuchiwanie na kliknięcie przycisku "Wyświetl"
document.getElementById('showFriendsButton').addEventListener('click', function() {
    fetch('/api/get-friends', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const friendsList = document.getElementById('friendsList');
            friendsList.innerHTML = ''; // Wyczyść listę

            console.log('Pobrano listę znajomych:', data.friends); // Debug

            // Dodaj znajomych do listy
            data.friends.forEach(friend => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `
                    ${friend.firstname_users} ${friend.lastname_users} (${friend.email_users})
                    <button class="btn btn-danger btn-sm float-end" onclick="removeFriend(${friend.id_users})">Usuń</button>
                `;
                friendsList.appendChild(listItem);
            });

            // Pokaż modal
            const friendsModal = new bootstrap.Modal(document.getElementById('friendsModal'));
            friendsModal.show();
        } else {
            console.error('Błąd podczas pobierania listy znajomych:', data.error); // Debug
        }
    })
    .catch(err => {
        console.error('Błąd podczas pobierania znajomych:', err); // Debug
    });
});

// Funkcja usuwania znajomego
function removeFriend(friendId) {
    console.log('Próba usunięcia znajomego o ID:', friendId); // Debug

    if (confirm("Czy na pewno chcesz usunąć tego znajomego?")) {
        fetch(`/api/remove-friend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendId })  // Przekazujemy tylko ID znajomego
        })
        .then(response => response.json())
        .then(data => {
            console.log('Otrzymane dane z serwera po próbie usunięcia znajomego:', data); // Debug

            if (data.status === 'success') {
                alert('Znajomy został usunięty.');
                location.reload(); // Odśwież stronę po usunięciu
            } else {
                alert('Błąd podczas usuwania znajomego.');
            }
        })
        .catch(err => {
            console.error('Błąd podczas usuwania znajomego:', err); // Debug
        });
    }
}



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
            // Sprawdź, czy elementy istnieją
            const friendModalLabel = document.getElementById('friendModalLabel');
            const friendEmailInfo = document.getElementById('friendEmailInfo');
            const inviteButton = document.getElementById('inviteButton');

            // Sprawdź, czy wszystkie elementy istnieją zanim ich użyjesz
            if (!friendModalLabel || !friendEmailInfo || !inviteButton) {
                console.error('Brakuje jednego lub więcej elementów modala');
                return;
            }

            // Ustaw dane w modalu
            friendModalLabel.textContent = "Znaleziono użytkownika";
            friendEmailInfo.textContent = `Użytkownik: ${data.user.email_users}`;
            
            // Dodaj funkcję do przycisku zaproszenia
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
        } else if (data.status === 'error' && data.error === 'Użytkownicy są już znajomymi.') {
            // Zamknij modal, a następnie pokaż alert, że użytkownicy są już znajomymi
            friendModal.hide(); 
            alert('Użytkownicy są już znajomymi.');
        } else {
            console.error(`Błąd zapraszania znajomego: ${data.error}`);
        }
    })
    .catch(err => {
        console.error('Błąd zapraszania znajomego:', err);
    });
}
