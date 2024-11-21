$(document).ready(function () {
    // Login Form Submit Logic
    $('#loginForm').submit(function (e) {
        e.preventDefault();

        const username = $('#login-username').val();
        const password = $('#login-password').val();

        // Retrieve the stored username and password from local storage
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');

        // Check if username exists in local storage
        if (username === storedUsername) {
            // If the username exists, check if the password matches
            if (password === storedPassword) {
                // Redirect to add.html after successful login
                window.location.href = 'record.html';
            } else {
                alert('Incorrect password. Please try again.');
            }
        } else {
            alert('This username is not registered. Please sign up first.');
        }
    });

    // Sign Up link functionality
    $('#signUpLink').click(function (e) {
        e.preventDefault();
        window.location.href = 'signup.html'; // Redirect to Sign Up page (index.html)
    });
});
