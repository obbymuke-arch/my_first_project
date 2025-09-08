// main.js - Global JS for CareerJobConnect
// Add global UI logic, notifications, and helpers here

document.addEventListener('DOMContentLoaded', function() {
    // Example: Show notification bar message
    const notificationBar = document.getElementById('notification-bar');
    if (notificationBar) {
        notificationBar.textContent = 'Welcome to CareerJobConnect!';
        setTimeout(() => {
            notificationBar.textContent = '';
        }, 4000);
    }
});
