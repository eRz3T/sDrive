document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
        firstname: document.getElementById('editFirstName').value.trim(),
        lastname: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        password: document.getElementById('editPassword').value.trim(),
        dateofbirth: document.getElementById('editDateOfBirth').value,
    };

    try {
        const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert('Dane użytkownika zostały zaktualizowane.');
            window.location.reload();
        } else {
            alert(`Błąd: ${result.error}`);
        }
    } catch (error) {
        console.error('Błąd podczas aktualizacji danych użytkownika:', error);
        alert('Wystąpił błąd podczas aktualizacji danych.');
    }
});
