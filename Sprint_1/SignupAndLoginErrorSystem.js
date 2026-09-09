
// Purpose: To validate the user input in the signup and login forms
const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const username_input = document.getElementById('username-input')
const password_input = document.getElementById('password-input')
const id_input = document.getElementById('id-input')
const email_input = document.getElementById('email-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

export function clearAllErrors() {
    const errorFields = [
        firstname_input,
        username_input,
        password_input,
        email_input,
        repeat_password_input
    ];

    errorFields.forEach(input => {
        if (input && input.parentElement.classList.contains('error')) {
            input.parentElement.classList.remove('error');
        }
    });

    const errorMsg = document.getElementById('error-message');
    if (errorMsg && errorMsg.style.color === 'red') { 
        errorMsg.innerText = '';
    }
}

//add an event listener to the form to check for errors when the form is submitted
form?.addEventListener('submit', (e) => {

    let errors = []

    if(firstname_input){
        //if we have the firstname then that means we are in the sign-up page 
        errors = getSignupFormErrors(firstname_input.value, username_input.value, email_input.value, password_input.value, repeat_password_input.value)
    }else if(id_input){
        //we are in the Doctor login page, only have the email, id, and password
        errors = getDoctorLoginFormErrors(email_input.value, id_input.value, password_input.value)
    }else{
        //we are in the login page, only have the username and password
        errors = getLoginFormErrors(username_input.value, password_input.value)
    }

    //if there are errors, prevent the form from submitting and alert the user
    if(errors.length > 0){
        e.preventDefault()
        if (error_message) {
            error_message.innerText = errors.join(", ");
            error_message.style.color = 'red';
        }
    }
});

//function to check for errors in the signup form
export function getSignupFormErrors(firstname, username, email, password, repeat_password){
    let errors = []

    //check if the firstname, username, password and repeat password are empty
    //if they are empty, add an error message to the errors array and add the error class to the input field
    if(!firstname){
        errors.push('First name is required')
        firstname_input?.parentElement?.classList.add('error')
    }

    if(!username){
        errors.push('Username is required')
        username_input?.parentElement?.classList.add('error')
    }

    if(!email){
        errors.push('Email is required')
        email_input?.parentElement?.classList.add('error')
    }

    if(!password){
        errors.push('Password is required')
        password_input?.parentElement?.classList.add('error')
    }

    if(password.length < 8){
        errors.push('Password must be at least 8 characters long')
        password_input?.parentElement?.classList.add('error')
    }
    if(repeat_password !== password){
        errors.push('Passwords do not match')
        password_input?.parentElement?.classList.add('error')
        repeat_password_input?.parentElement?.classList.add('error')
    }

    return errors
}
//function to check for errors in the login form
export function getLoginFormErrors(username, password){
    let errors = []

    //check if the username and password are empty
    //if they are empty, add an error message to the errors array and add the error class to the input field
    if(!username){
        errors.push('Username is required')
        username_input?.parentElement?.classList.add('error')
    }

    if(!password){
        errors.push('Password is required')
        password_input?.parentElement?.classList.add('error')
    }

    return errors
}

//function to check for errors in the Doctor login form
export function getDoctorLoginFormErrors(email, id, password){
    let errors = []

    //check if the username and password are empty
    //if they are empty, add an error message to the errors array and add the error class to the input field
    if(!email){
        errors.push('Email is required')
        email_input?.parentElement?.classList.add('error')
    }

    if(!id){
        errors.push('Id is required')
        id_input?.parentElement?.classList.add('error')
    }

    if(!password){
        errors.push('Password is required')
        password_input?.parentElement?.classList.add('error')
    }

    return errors
}

//add an event listener to the input fields to remove the error class when the user starts typing
const allinputs = [firstname_input, username_input, password_input, email_input, id_input, repeat_password_input].filter(input => input !== null)

//loop through all the input fields and add an event listener to remove the error class when the user starts typing
allinputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('error')){
            input.parentElement.classList.remove('error')
            error_message.innerText = ''
        }
    })
})