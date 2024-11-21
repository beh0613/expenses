$(document).ready(function () {
    // Sign In Form Submit Logic
    $('#signInForm').submit(function (e) {
        e.preventDefault();

        const username = $('#login-username').val();
        const password = $('#login-password').val();
        const confirmPassword = $('#confirm-password').val();

        // Password validation: at least 8 characters, includes number, uppercase, lowercase, special character
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        // Simple validation for Sign In
        if (username && password && confirmPassword) {
            if (password === confirmPassword) {
                if (passwordPattern.test(password)) {
                    // Check if the username already exists in localStorage
                    const storedUsername = localStorage.getItem('username');

                    if (storedUsername === username) {
                        // If username already exists, alert the user and prompt for a different username
                        alert('Username already exists. Please choose a different username.');
                    } else {
                        // Store the username and password in local storage
                        localStorage.setItem('username', username);
                        localStorage.setItem('password', password);

                        // Inform the user that the account has been signed up
                        alert('Account successfully created! You can now log in.');

                        // Redirect to the login page (login.html)
                        window.location.href = 'login.html';
                    }
                } else {
                    alert('Password must be at least 8 characters long and include a number, uppercase, lowercase, and a special character!');
                }
            } else {
                alert('Passwords do not match!');
            }
        } else {
            alert('Please fill in all fields!');
        }
    });
});
