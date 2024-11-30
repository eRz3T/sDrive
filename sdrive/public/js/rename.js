function openRenameFileModal(fileId, fileName) {
    document.getElementById('fileToRename').value = fileId;
    document.getElementById('newFileName').value = fileName;
    const renameModal = new bootstrap.Modal(document.getElementById('renameFileModal'));
    renameModal.show();
}

document.getElementById('renameFileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileId = document.getElementById('fileToRename').value;
    const newFileName = document.getElementById('newFileName').value.trim();

    if (!newFileName) {
        alert('Nazwa pliku nie może być pusta.');
        return;
    }

    try {
        const response = await fetch(`/api/file/rename/${fileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newFileName }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Nazwa pliku została zmieniona.');
            window.location.reload(); // Odświeżenie strony
        } else {
            alert(`Błąd: ${data.error}`);
        }
    } catch (error) {
        console.error('Błąd podczas zmiany nazwy pliku:', error);
        alert('Wystąpił błąd podczas zmiany nazwy pliku.');
    }
});
