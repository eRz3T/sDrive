// fshareShared.js

function shareSharedFile() {
    const fileToShare = document.getElementById('sharedFileToShare').value;
    const selectedFriendId = document.getElementById('sharedFriendSelect').value;

    console.log('Udostępnione pliki: Rozpoczęto udostępnianie udostępnionego pliku:', { fileToShare, selectedFriendId });

    fetch('/api/share-shared-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileToShare: fileToShare,
            receiverSafeId: selectedFriendId
        })
    })
    .then(response => {
        // Sprawdź, czy odpowiedź jest w formacie JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Odpowiedź z serwera po udostępnieniu udostępnionego pliku:', data);

        if (data.status === 'success') {
            alert(data.success);
            location.reload(); // Odśwież stronę po udostępnieniu
        } else {
            alert(data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas udostępniania udostępnionego pliku:', err);
        alert('Wystąpił błąd podczas udostępniania pliku.');
    });
}

function openSharedFileModal(filename, truename) {
    document.getElementById('sharedFileToShare').value = filename;
    document.getElementById('sharedFileToShareName').innerText = truename;
    let shareSharedFileModal = new bootstrap.Modal(document.getElementById('shareSharedFileModal'));
    shareSharedFileModal.show();
}
