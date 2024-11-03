function respondToFriendRequest(noteId, action) {
    console.log(`Wysyłam odpowiedź: noteId=${noteId}, action=${action}`); // Debugowanie
    
    fetch(`/api/respond-friend-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noteId, action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            setTimeout(() => location.reload(), 100); 
        } else {
            alert(data.error); // Wyświetl komunikat o błędzie
            setTimeout(() => location.reload(), 500); 
        }
    })
    .catch(err => {
        console.error('Błąd podczas odpowiedzi na zaproszenie do znajomych:', err);
        alert('Wystąpił błąd podczas odpowiedzi na zaproszenie.');
    });
}
