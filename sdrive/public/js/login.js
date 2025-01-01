const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();  
    const login = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        totp: document.getElementById("totp").value // Dodanie kodu Google Authenticator
    };

    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
        .then(data => {
            console.log("Odpowiedź z backendu:", data);  // Debugowanie
            if (data.status === "error") {
                document.getElementById("success").style.display = "none";
                document.getElementById("error").style.display = "block";
                document.getElementById("error").innerText = data.error;
            } else {
                window.location.href = data.redirect;
            }
        })
        .catch(err => {
            document.getElementById("error").style.display = "block";
            document.getElementById("error").innerText = "Wystąpił błąd podczas logowania.";
            console.error(err);
        });
});
