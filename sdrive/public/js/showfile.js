function showFileContent(filename) {
    fetch(`/show/${filename}`)
    .then(response => response.text())
    .then(content => {
        document.getElementById('fileContent').textContent = content;
        let fileContentModal = new bootstrap.Modal(document.getElementById('fileContentModal'));
        fileContentModal.show();
    })
    .catch(err => {
        console.error('Błąd podczas wczytywania pliku:', err);
        alert('Nie udało się wczytać pliku');
    });
}
