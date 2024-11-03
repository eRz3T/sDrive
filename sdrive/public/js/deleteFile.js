function deleteFile(filename) {
    fetch(`/delete/${filename}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert(data.success);
            location.reload(); // Odśwież stronę po usunięciu pliku
        } else {
            alert(data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas usuwania pliku:', err);
        alert('Wystąpił błąd podczas usuwania pliku.');
    });
}

function deleteSharedFile(filename) {
    fetch(`/delete/shared/${filename}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Plik udostępniony został usunięty.');
            location.reload();  // Odśwież stronę, aby zaktualizować listę plików
        } else {
            alert('Nie udało się usunąć pliku: ' + data.error);
        }
    })
    .catch(err => {
        console.error('Błąd podczas usuwania pliku:', err);
        alert('Wystąpił błąd podczas usuwania pliku');
    });
}
