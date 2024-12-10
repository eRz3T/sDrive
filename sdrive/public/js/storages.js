let selectedFileId = null;
let selectedFileName = null;

function goBack() {
    window.location.href = '/home';
}

function selectFile(fileId, fileName) {
    selectedFileId = fileId;
    selectedFileName = fileName;

    console.log(`DEBUG: Wybrano plik - ID: ${selectedFileId}, Nazwa: ${selectedFileName}`);

    document.querySelectorAll('.file-list-item').forEach(item => {
        item.classList.remove('active');
    });

    const selectedItem = document.querySelector(`[data-file-id="${fileId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    // Aktywuj przyciski dla wybranego pliku
    document.getElementById('deleteButton').removeAttribute('disabled');
    document.getElementById('editFileNameButton').removeAttribute('disabled');
    loadFileContent(fileId);
}





async function deleteFile() {
    if (!selectedFileId) {
        alert('Wybierz plik przed usunięciem.');
        return;
    }

    const storageId = window.location.pathname.split('/').pop();

    if (!confirm(`Czy na pewno chcesz usunąć plik "${selectedFileName}" z magazynu?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/storage/${storageId}/remove-file/${selectedFileId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert(data.message);
            window.location.reload();
        } else {
            alert(`Błąd: ${data.error}`);
        }
    } catch (err) {
        console.error('Błąd podczas usuwania pliku:', err);
        alert('Wystąpił błąd podczas usuwania pliku.');
    }
}

function loadFileContent(fileId) {
    const storageId = window.location.pathname.split('/').pop();

    // Pobierz wersję pliku z atrybutu HTML
    const selectedFileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    const fileVersion = selectedFileElement ? selectedFileElement.getAttribute("data-file-version") : null;

    fetch(`/api/storage-file/${fileId}/edit?storageId=${storageId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const editor = document.getElementById('editor');
                editor.value = data.content;
                editor.removeAttribute('readonly');
                document.getElementById('saveButton').removeAttribute('disabled');

                // Przechowaj wersję pliku globalnie
                selectedFileElement.setAttribute("data-current-version", fileVersion);
            } else {
                alert(`Błąd: ${data.error}`);
            }
        })
        .catch(err => {
            console.error('Błąd podczas wczytywania pliku:', err);
        });
}


function saveFile() {
    if (!selectedFileId) {
        alert('Wybierz plik przed zapisem.');
        return;
    }

    const content = document.getElementById('editor').value;
    const storageId = window.location.pathname.split('/').pop();

    const selectedFileElement = document.querySelector(`[data-file-id="${selectedFileId}"]`);
    const currentVersion = selectedFileElement ? selectedFileElement.getAttribute("data-current-version") : null;

    if (!currentVersion) {
        alert('Nie udało się pobrać wersji pliku.');
        return;
    }

    fetch(`/api/storage-file/${selectedFileId}/save?storageId=${storageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, currentVersion: parseInt(currentVersion, 10) }),
    })
        .then(response => {
            if (response.status === 409) {
                return response.json().then(data => {
                    handleVersionConflict(data.expectedVersion);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);

                const newVersion = parseInt(currentVersion, 10) + 1;
                selectedFileElement.setAttribute("data-current-version", newVersion);
                selectedFileElement.querySelector(".file-version").textContent = `Ver. ${newVersion}`;
            } else if (data.status !== 'error') {
                alert('Błąd zapisu pliku: ' + data.error);
            }
        })
        .catch(err => {
            console.error('Błąd zapisu pliku:', err);
            alert('Wystąpił błąd podczas zapisywania pliku.');
        });
}




function downloadStorage() {
    const storageId = window.location.pathname.split('/').pop();

    fetch(`/download-storage/${storageId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            const storageNameElement = document.querySelector('.storage-name');
            if (!storageNameElement) {
                throw new Error('Nie znaleziono elementu z nazwą magazynu.');
            }

            const storageName = storageNameElement.textContent.trim();
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${storageName}.zip`;
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
        })
        .catch(err => {
            console.error('Błąd podczas pobierania magazynu:', err);
            alert(`Wystąpił błąd podczas pobierania magazynu: ${err.message}`);
        });
}

async function addFilesToStorage() {
    const storageId = window.location.pathname.split('/').pop();
    const selectedFiles = Array.from(document.querySelectorAll('input.add-file-checkbox:checked')).map(input => input.value);

    if (selectedFiles.length === 0) {
        alert('Wybierz przynajmniej jeden plik do dodania.');
        return;
    }

    try {
        const response = await fetch(`/api/storage/${storageId}/add-files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selectedFiles })
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert(data.message);
            window.location.reload();
        } else {
            alert(`Błąd: ${data.error}`);
        }
    } catch (err) {
        console.error('Błąd podczas dodawania plików do magazynu:', err);
        alert('Wystąpił błąd podczas dodawania plików do magazynu.');
    }
}

function openEditFileNameModal() {
    if (!selectedFileId || !selectedFileName) {
        alert("Wybierz plik, aby edytować jego nazwę.");
        return;
    }

    // Ustaw aktualną nazwę pliku jako domyślną wartość w polu edycji
    document.getElementById("newFileName").value = selectedFileName;
    const editModal = new bootstrap.Modal(document.getElementById("editFileNameModal"));
    editModal.show();
}

async function submitFileNameEdit() {
    const newFileName = document.getElementById("newFileName").value.trim();
    if (!newFileName) {
        alert("Nazwa pliku nie może być pusta.");
        console.error("Błąd: Pusta nazwa pliku.");
        return;
    }

    const storageId = window.location.pathname.split("/").pop();
    console.log("Rozpoczęcie edycji nazwy pliku:", { storageId, selectedFileId, newFileName });

    try {
        const response = await fetch(`/api/storage/${storageId}/edit-file-name/${encodeURIComponent(selectedFileId)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newFileName }),
        });

        const rawResponse = await response.text();
        console.log("Odpowiedź serwera (surowa):", rawResponse);

        // Jeśli odpowiedź nie jest JSON, pokaż błąd
        if (!response.ok) {
            throw new Error(`Serwer zwrócił status ${response.status}`);
        }

        const data = JSON.parse(rawResponse);
        console.log("Odpowiedź serwera (JSON):", data);

        if (data.status === "success") {
            alert(data.message);
            window.location.reload();
        } else {
            alert(`Błąd: ${data.error}`);
        }
    } catch (err) {
        console.error("Błąd podczas edytowania nazwy pliku:", err);
        alert("Wystąpił błąd podczas edytowania nazwy pliku.");
    }
}




async function fetchUserStorages() {
    try {
        const response = await fetch('/api/get-user-storages');
        const data = await response.json();

        if (data.status === 'success') {
            renderStorages(data.storages);
        } else {
            alert('Nie udało się pobrać magazynów.');
        }
    } catch (err) {
        console.error('Błąd podczas pobierania magazynów:', err);
        alert('Wystąpił błąd podczas pobierania magazynów.');
    }
}

function renderStorages(storages) {
    const storagesList = document.getElementById('storagesList');
    storagesList.innerHTML = '';

    if (storages.length === 0) {
        storagesList.innerHTML = '<li class="list-group-item">Brak dostępnych magazynów.</li>';
        return;
    }

    storages.forEach(storage => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <span>${storage.name_storages}</span>
            <div>
                <button class="btn btn-sm btn-primary me-2" onclick="manageStorage('${storage.id_storages}')">Zarządzaj</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStorage('${storage.id_storages}')">Usuń</button>
            </div>
        `;
        storagesList.appendChild(listItem);
    });
}

function manageStorage(storageId) {
    window.location.href = `/storage/${storageId}`;
}

document.getElementById('allStoragesModal').addEventListener('show.bs.modal', fetchUserStorages);


function openShareModal() {
    fetch('/api/get-friends')
        .then(response => response.json())
        .then(data => {
            console.log('Dane znajomych:', data); // DEBUG
            if (data.status === 'success') {
                const friendsList = document.getElementById('friendsList');
                friendsList.innerHTML = ''; // Wyczyść listę
                data.friends.forEach(friend => {
                    const listItem = `
                        <div class="list-group-item">
                            <input 
                                type="checkbox" 
                                class="form-check-input me-2" 
                                id="friend${friend.id_users}" 
                                value="${friend.id_users}">
                            <label class="form-check-label" for="friend${friend.id_users}">
                                ${friend.firstname_users} ${friend.lastname_users}
                            </label>
                        </div>
                    `;
                    friendsList.insertAdjacentHTML('beforeend', listItem);
                });
                // Pokaż modal
                new bootstrap.Modal(document.getElementById('shareModal')).show();
            } else {
                console.error('Błąd pobierania znajomych:', data.error);
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function shareStorage() {
    const storageId = window.location.pathname.split('/').pop();
    const selectedFriends = Array.from(document.querySelectorAll('#friendsList input:checked'))
        .map(input => input.value);

    if (selectedFriends.length === 0) {
        alert('Wybierz co najmniej jednego znajomego!');
        return;
    }

    fetch('/api/storage/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            storageId: storageId,
            friends: selectedFriends,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Magazyn został udostępniony!');
                location.reload();
            } else {
                alert('Błąd: ' + data.error);
            }
        })
        .catch(error => console.error('Błąd:', error));
}

function fetchSharedStorages() {
    fetch("/api/shared-storages")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const storagesList = document.getElementById("sharedStoragesList");
                storagesList.innerHTML = ""; // Wyczyść poprzednią zawartość

                if (data.storages.length === 0) {
                    storagesList.innerHTML = '<li class="list-group-item">Brak udostępnionych magazynów.</li>';
                } else {
                    data.storages.forEach(storage => {
                        const listItem = document.createElement("li");
                        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                        listItem.innerHTML = `
                            <span>${storage.name_storages} <small>(Właściciel: ${storage.firstname_users} ${storage.lastname_users})</small></span>
                            <button class="btn btn-primary btn-sm" onclick="openStorage(${storage.id_storages})">Otwórz</button>
                        `;
                        storagesList.appendChild(listItem);
                    });
                }
            } else {
                console.error("Błąd pobierania magazynów:", data.error);
            }
        })
        .catch(err => console.error("Błąd podczas pobierania udostępnionych magazynów:", err));
}

function openStorage(storageId) {
    window.location.href = `/storage/${storageId}`;
}

function handleVersionConflict(expectedVersion) {
    const modal = new bootstrap.Modal(document.getElementById('versionConflictModal'));
    const conflictMessage = document.getElementById('conflictMessage');

    conflictMessage.textContent = `Wykryto nowszą wersję pliku! Aktualna wersja: Ver. ${expectedVersion}`;

    // Otwórz modal
    modal.show();
}


function reloadPage() {
    window.location.reload();
}

function resolveConflict() {
    const newContent = document.getElementById('serverContent').value;

    fetch(`/api/resolve-conflict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fileId: '<%= fileId %>',
            storageId: '<%= storageId %>',
            newContent: newContent,
        }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === 'success') {
            alert('Konflikt został rozwiązany.');
            window.location.href = `/storage/${'<%= storageId %>'}`;
        } else {
            alert(`Błąd: ${data.error}`);
        }
    })
    .catch((err) => {
        console.error('Błąd podczas rozwiązywania konfliktu:', err);
        alert('Wystąpił błąd podczas rozwiązywania konfliktu.');
    });
}


function handleConflict(content) {
    const storageId = window.location.pathname.split('/').pop();

    if (!selectedFileId) {
        alert('Nie wybrano pliku do rozwiązania konfliktu.');
        console.error('DEBUG: Brak `selectedFileId`.');
        return;
    }

    if (!storageId) {
        alert('Nie udało się pobrać identyfikatora magazynu.');
        return;
    }

    console.log(`DEBUG: Rozpoczęcie obsługi konfliktu dla pliku: ${selectedFileId}`);

    fetch(`/api/save-conflicted-file?storageId=${storageId}&fileId=${selectedFileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.href = `/file-conflict?fileId=${selectedFileId}&storageId=${storageId}`;
            } else {
                alert(`Błąd: ${data.error}`);
            }
        })
        .catch((err) => {
            console.error('Błąd podczas obsługi konfliktu pliku:', err);
            alert('Wystąpił błąd podczas obsługi konfliktu pliku.');
        });
}

function discardChanges() {
    // Symulacja kliknięcia przycisku "Wstecz" w przeglądarce
    window.history.back();

    // Odświeżenie strony po powrocie
    setTimeout(() => {
        window.location.reload();
    }, 500); // Odczekaj 500 ms, aby historia przeglądarki miała czas na wykonanie akcji
}

function resolveConflict() {
    const fileId = new URLSearchParams(window.location.search).get('fileId');
    const storageId = new URLSearchParams(window.location.search).get('storageId');
    const content = document.getElementById('serverContent').value;

    if (!fileId || !storageId) {
        alert('Brak wymaganych danych do rozwiązania konfliktu.');
        return;
    }

    fetch(`/api/file-conflict/${fileId}/resolve?storageId=${storageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                alert('Konflikt został rozwiązany.');
                window.location.href = `/storage/${storageId}`;
            } else {
                alert(`Błąd: ${data.error}`);
            }
        })
        .catch((err) => {
            console.error('Błąd podczas rozwiązywania konfliktu:', err);
            alert('Wystąpił błąd podczas rozwiązywania konfliktu.');
        });
}


