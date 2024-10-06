const form = document.getElementById("registerForm");

form.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const register = {
        email: document.getElementById("email").value,  
        password: document.getElementById("password").value  
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
            }
        });
});
