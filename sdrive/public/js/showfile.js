let currentHtmlFilePath = null;

function showFileContent(filename, isShared = false) {
    const url = isShared ? `/show/shared/${filename}` : `/show/${filename}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania pliku');
            }
            return response.json();
        })
        .then(data => {
            currentHtmlFilePath = data.htmlFilePath ? data.htmlFilePath : null;

            const fileContentLabel = document.getElementById('fileContentLabel');
            const fileContent = document.getElementById('fileContent');

            if (!fileContentLabel || !fileContent) {
                throw new Error('Elementy modalne nie zostały załadowane na stronę');
            }

            fileContentLabel.innerText = data.originalName;
            fileContent.innerHTML = data.content;

            let fileContentModal = new bootstrap.Modal(document.getElementById('fileContentModal'));
            fileContentModal.show();
        })
        .catch(err => {
            console.error('Błąd podczas wczytywania pliku:', err);
            alert('Nie udało się wczytać pliku');
        });
}

function removeHtmlCopy() {
    if (currentHtmlFilePath) {
        fetch(`/remove-html`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ htmlFilePath: currentHtmlFilePath })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Plik .html został usunięty.');
            } else {
                console.error('Błąd podczas usuwania pliku .html:', data.error);
            }
        })
        .catch(err => {
            console.error('Błąd podczas usuwania pliku .html:', err);
        });
    }
    currentHtmlFilePath = null;
}

document.getElementById('fileContentModal').addEventListener('hidden.bs.modal', removeHtmlCopy);
