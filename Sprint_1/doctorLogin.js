document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async function handleDoctorLogin(event) {
        event.preventDefault();

        const email = document.getElementById('email-input').value.trim();
        const id = document.getElementById('id-input').value.trim();
        const password = document.getElementById('password-input').value.trim();

        try {
            const response = await fetch('/doctor-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, id, password })
            });

            const result = await response.json();

            if (response.ok) {
                const { message, user } = result;

                errorMessage.textContent = message;
                errorMessage.style.color = 'green';

                // ✅ Store doctor info in session
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                setTimeout(() => {
                    window.location.href = '/home/index.html';
                }, 1000);
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Login request failed.';
            errorMessage.style.color = 'red';
        }
    });
});