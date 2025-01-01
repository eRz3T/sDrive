const form = document.getElementById("registerForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const register = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        birthDate: document.getElementById("birthDate").value
    };

    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
            if (data.status === "error") {
                document.getElementById("success").style.display = "none";
                document.getElementById("error").style.display = "block";
                document.getElementById("error").innerText = data.error;
            } else {
                document.getElementById("error").style.display = "none";
                document.getElementById("success").style.display = "block";
                document.getElementById("success").innerText = data.success;

                // Wyświetl kod QR w oknie modalnym, jeśli jest dostępny
                if (data.qrCode) {
                    document.getElementById("qrCodeImage").src = data.qrCode;
                    const modal = new bootstrap.Modal(document.getElementById("googleAuthModal"));
                    modal.show();
                }
            }
        })
        .catch(err => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerText = "Wystąpił błąd podczas rejestracji.";
            console.error(err);
        });
});
