import {clearAllErrors, getSignupFormErrors} from "./SignupAndLoginErrorSystem.js";

// This script handles the signup form submission and validation.
// It uses the Fetch API to send a POST request to the server with the form data.
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    // Add event listener to the form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Call the validation logic from SignupAndLoginErrorSystem.js
        const firstname = document.getElementById("firstname-input").value.trim();
        const username = document.getElementById("username-input").value.trim();
        const email = document.getElementById("email-input").value.trim();
        const password = document.getElementById("password-input").value.trim();
        const repeatPassword = document.getElementById("repeat-password-input").value.trim();

        const errors = getSignupFormErrors(firstname, username, email, password, repeatPassword);

        if (errors.length > 0) {
            // Display validation errors
            errorMessage.textContent = errors.join(", ");
            errorMessage.style.color = "red";
            return;
        }

        // Prepare form for SVGAnimatedInteger.
        const formData = {
            firstname,
            username,
            email,
            password
        };

        // If no errors, proceed with form submission
        try {
            // Send the form data to the server using Fetch API
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                //send the data as JSON
                body: JSON.stringify({firstname, username, email, password}),
            })
            
            if (response.ok) {
                const {message, user} = await response.json();

                clearAllErrors();
                errorMessage.textContent = message; // Show success message
                errorMessage.style.color = "green"; // Change text color to green
                // Redirect to the next page or perform additional actions
                
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                // Short delay then redirect to index.html
                setTimeout(() => {
                    window.location.href = "/home/index.html"; // Redirect to the main page after signup
                }, 1000); // Optional delay for the message to be seen
            } else {
                const result = await response.json();
                errorMessage.textContent = result.message; // Show error message from server
                errorMessage.style.color = "red";
            }
        } catch (error) {
            errorMessage.textContent = "Error: " + error.message;
            errorMessage.style.color = "red";
        }
    });
});
