$(document).ready(function () {
    // Check if this is a username change request
    const isChangingUsername = new URLSearchParams(window.location.search).get('change') === 'true';

    // Only redirect if user is logged in AND not trying to change username
    const currentUser = localStorage.getItem('currentUser');
    

    // Pre-fill username field if changing username
    if (isChangingUsername && currentUser) {
        $('#login-username').val(currentUser);
        // Automatically show change username section
        $('#loginForm').hide();
        $('.change-username-link').hide();
        $('#changeUsernameSection').removeClass('hidden');
        $('#current-username').val(currentUser);
    }

    // Handle login form submission
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const username = $('#login-username').val().trim();
        const password = $('#psw').val().trim();  // Added password field

        // Basic validation
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        // Get existing users from localStorage or create an empty array
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user exists
        const existingUser = users.find(user => user.username === username);

        if (!existingUser) {
            // If user doesn't exist, create a new user with the entered password
            users.push({
                username: username,
                password: password,  // Save password for new user
                joinDate: new Date().toISOString()
            });
            localStorage.setItem('users', JSON.stringify(users));
            showSuccess('New user created! Redirecting...');
        } else {
            // If user exists, check if password matches
            if (existingUser.password !== password) {
                showError('Incorrect password');
                return;
            }

            showSuccess('Login successful! Redirecting...');
        }

        // Save current user to localStorage
        localStorage.setItem('currentUser', username);

        // Redirect to main page after short delay
        setTimeout(() => {
            window.location.href = 'profilepic.html';
        }, 1500);
    });

    $('#showChangeUsername').on('click', function (e) {
        e.preventDefault();
        $('#loginForm').hide();
        $('.change-username-link').hide();
        $('#changeUsernameSection').removeClass('hidden');
    });

    $('#cancelChange').on('click', function () {
        if (isChangingUsername) {
            // If came from record page, go back there
            window.location.href = 'record.html';
        } else {
            // Otherwise just show login form
            $('#changeUsernameSection').addClass('hidden');
            $('#loginForm').show();
            $('.change-username-link').show();
            $('#changeUsernameForm')[0].reset();
        }
    });

    // Check password and enable new username field when "Check" button is clicked
    $('#checkPasswordBtn').on('click', function () {
        const currentUsername = $('#current-username').val().trim();
        const password = $('#password').val().trim();

        if (!currentUsername || !password) {
            showError('Please enter both username and password');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === currentUsername);

        if (!user) {
            showError('Username not found');
            return;
        }

        if (user.password !== password) {
            showError('Incorrect password');
            return;
        }

        // Enable the "new username" input and submit button
        $('#new-username').prop('disabled', false);
        $('#changeUsernameForm button[type="submit"]').prop('disabled', false);

        showSuccess('Password correct. You can now change the username.');
    });

    // Handle username change
    $('#changeUsernameForm').on('submit', function (e) {
        e.preventDefault();

        const currentUsername = $('#current-username').val().trim();
        const newUsername = $('#new-username').val().trim();

        if (!currentUsername || !newUsername) {
            showError('Please fill in all fields');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUsername);

        if (userIndex === -1) {
            showError('Current username not found');
            return;
        }

        // Check if new username already exists
        if (users.some(user => user.username === newUsername)) {
            showError('New username already exists');
            return;
        }

        // Update username
        users[userIndex].username = newUsername;
        localStorage.setItem('users', JSON.stringify(users));

        // Update currentUser if the user changing their name is logged in
        if (localStorage.getItem('currentUser') === currentUsername) {
            localStorage.setItem('currentUser', newUsername);
        }

        showSuccess('Username changed successfully! Redirecting...');

        // Redirect back to record page after username change
        setTimeout(() => {
            window.location.href = 'profilepic.html';
        }, 1500);
    });

    // Helper functions remain the same
    function showError(message) {
        $('.message').remove();
        const errorDiv = $('<div>')  
            .addClass('message error') 
            .text(message) 
            .hide()
            .insertAfter('#loginForm');

        errorDiv.fadeIn(300);

        setTimeout(() => {
            errorDiv.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    function showSuccess(message) {
        $('.message').remove();
        const successDiv = $('<div>')  
            .addClass('message success') 
            .text(message) 
            .hide()
            .insertAfter('#loginForm');

        successDiv.fadeIn(300);

        setTimeout(() => {
            successDiv.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }
});
