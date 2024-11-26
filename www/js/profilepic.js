$(document).ready(function () {
    // Load existing profile picture and username
    const selectedProfilePicture = localStorage.getItem('selectedProfilePicture') || 'image/defaultProfilePic.png';
    const currentUser = localStorage.getItem('currentUser') || 'Guest';

    $('#currentProfilePic').attr('src', selectedProfilePicture);
    $('#welcomeMessage').text(`Welcome, ${currentUser}!`);

    // Profile picture selection
    const profileButtons = document.querySelectorAll('.profile-button');

    profileButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newProfilePic = button.getAttribute('data-src');

            // Update the displayed profile picture
            $('#currentProfilePic').attr('src', newProfilePic);

            // Highlight the selected profile button
            profileButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // Save the new profile picture to localStorage
            localStorage.setItem('selectedProfilePicture', newProfilePic);
        });
    });
});