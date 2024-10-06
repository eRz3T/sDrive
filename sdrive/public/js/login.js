form.addEventListener("submit", () => {
    const login = {
        email: email.vaule,
        password: password.value
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-Type":"application/json"
        }
    }).then(res=> res.json())
        .then(data => {
            if (statusbar.status == "error") {
                success.style.display = "none"
                error.style.display = "block"
                error.innerText = data.error
            } else {
                error.style.display = "none"
                success.style.display = "block"
                success.innerText = data.success
            }
        })
})
        