// fshareFile.js

function shareFile() {
    const fileToShare = document.getElementById('fileToShare').value;
    const selectedFriendId = document.getElementById('friendSelect').value;

    console.log('Twoje pliki: Rozpoczęto udostępnianie pliku:', { fileToShare, selectedFriendId });

    fetch('/api/share-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cryptedname_files: fileToShare,
            sharedFriendSafeId: selectedFriendId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Odpowiedź z serwera po udostępnieniu pliku:', data);

        if (data.status === 'success') {
            alert(data.success);
            location.reload();
        } else {
            alert(data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas udostępniania pliku:', err);
        alert('Wystąpił błąd podczas udostępniania pliku.');
    });
}

function openShareOwnFileModal(filename, truename) {
    document.getElementById('fileToShare').value = filename;
    document.getElementById('fileToShareName').innerText = truename;
    let shareOwnFileModal = new bootstrap.Modal(document.getElementById('shareFileModal'));
    shareOwnFileModal.show();
}
