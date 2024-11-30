document.addEventListener('DOMContentLoaded', () => {
    // Sprawdź, czy jesteśmy na stronie edycji pliku
    if (window.location.pathname.startsWith('/edit/')) {
        const filename = window.location.pathname.split('/').pop(); // Pobierz nazwę pliku z URL-a
        
        if (!filename || filename === 'home') {
            console.error('Nieprawidłowa nazwa pliku:', filename);
            return; // Nie wykonuj dalszych operacji
        }

        fetch(`/api/file/${filename}/edit`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('editor').value = data.content; // Wstaw zawartość pliku do edytora
                    document.getElementById('fileName').textContent = filename; // Ustaw nazwę pliku w nagłówku
                } else {
                    alert('Błąd wczytywania pliku: ' + data.error);
                }
            })
            .catch(err => console.error('Błąd pobierania zawartości pliku:', err));
    }
});

function editFile(filename) {
    if (filename) {
        window.location.href = `/edit/${filename}`;
    } else {
        console.error('Nie można edytować pliku bez nazwy');
    }
}

function saveFile() {
    const content = document.getElementById('editor').value;
    const filename = window.location.pathname.split('/').pop();

    if (!filename || filename === 'home') {
        alert('Nieprawidłowa nazwa pliku. Nie można zapisać.');
        return;
    }

    fetch(`/api/file/${filename}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Plik został zapisany pomyślnie!');
            } else {
                alert('Błąd zapisu pliku: ' + data.error);
            }
        })
        .catch(err => console.error('Błąd zapisu pliku:', err));
}

function goBack() {
    window.location.href = '/home'; // Przekierowanie na stronę główną
}
