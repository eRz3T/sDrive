function respondToFriendRequest(noteId, action) {
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
            alert(data.success);
            location.reload(); // Odśwież stronę po odpowiedzi
        } else {
            alert(data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas odpowiedzi na zaproszenie do znajomych:', err);
        alert('Wystąpił błąd podczas odpowiedzi na zaproszenie.');
    });
}