document.addEventListener('DOMContentLoaded', () => {
    const filename = window.location.pathname.split('/').pop(); // Pobierz nazwę pliku z URL-a

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
});

function editFile(filename) {
    window.location.href = `/edit/${filename}`;
}

function saveFile() {
    const content = document.getElementById('editor').value;
    const filename = window.location.pathname.split('/').pop();

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
