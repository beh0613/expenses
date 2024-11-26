$(document).ready(function () {
    // Handle the form submission
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();

        // Get form values
        const email = $('#email').val().trim();
        const username = $('#register-username').val().trim();
        const password = $('#register-password').val().trim();

        // Basic validation
        if (!email || !username || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Get existing users from localStorage or create an empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username already exists
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            showError('Username already taken');
            return;
        }

        // Create a new user object
        const newUser = {
            email: email,
            username: username,
            password: password,
            joinDate: new Date().toISOString(),
        };

        // Add the new user to the users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Save current user to localStorage
        localStorage.setItem('currentUser', username);

        // Show success message
        showSuccess('Registration successful! Redirecting...');

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    // Show error message
    function showError(message) {
        $('.message').remove();
        const errorDiv = $('<div>')
            .addClass('message error')
            .text(message)
            .hide()
            .insertAfter('#registerForm');

        errorDiv.fadeIn(300);

        setTimeout(() => {
            errorDiv.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // Show success message
    function showSuccess(message) {
        $('.message').remove();
        const successDiv = $('<div>')
            .addClass('message success')
            .text(message)
            .hide()
            .insertAfter('#registerForm');

        successDiv.fadeIn(300);

        setTimeout(() => {
            successDiv.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }
});
