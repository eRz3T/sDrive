let currentHtmlFilePath = null;  // Zmienna do przechowywania ścieżki pliku .html

function showFileContent(filename) {
    console.log(`Rozpoczęto wczytywanie pliku: ${filename}`);

    fetch(`/show/${filename}`)  // Używamy zaszyfrowanej nazwy pliku
    .then(response => response.json())
    .then(data => {
        console.log('Otrzymane dane:', data);

        // Przechowujemy ścieżkę do pliku .html, jeśli plik jest typu .docx
        currentHtmlFilePath = data.htmlFilePath ? data.htmlFilePath : null;

        const fileContentLabel = document.getElementById('fileContentLabel');
        const fileContent = document.getElementById('fileContent');

        if (!fileContentLabel || !fileContent) {
            throw new Error('Elementy modalne nie zostały załadowane na stronę');
        }

        // Ustawiamy dynamicznie nazwę pliku jako tytuł okna modalnego
        fileContentLabel.innerText = data.originalName;

        // Ustawiamy zawartość jako HTML
        fileContent.innerHTML = data.content;

        let fileContentModal = new bootstrap.Modal(document.getElementById('fileContentModal'));
        fileContentModal.show();
    })
    .catch(err => {
        console.error('Błąd podczas wczytywania pliku:', err);
        alert('Nie udało się wczytać pliku');
    });
}

// Funkcja wywoływana po zamknięciu modalnego okna
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
    currentHtmlFilePath = null;  // Zresetowanie ścieżki po usunięciu pliku
}

// Dodaj nasłuchiwanie na zamknięcie modalnego okna
document.getElementById('fileContentModal').addEventListener('hidden.bs.modal', removeHtmlCopy);
