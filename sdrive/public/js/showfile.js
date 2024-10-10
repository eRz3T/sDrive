function showFileContent(filename) {
    fetch(`/show/${filename}`)  // Używamy zaszyfrowanej nazwy pliku
    .then(response => response.text())
    .then(content => {
        document.getElementById('fileContent').textContent = content;  // Wyświetl zawartość w oknie modalnym
        let fileContentModal = new bootstrap.Modal(document.getElementById('fileContentModal'));
        fileContentModal.show();
    })
    .catch(err => {
        console.error('Błąd podczas wczytywania pliku:', err);
        alert('Nie udało się wczytać pliku');
    });
}
