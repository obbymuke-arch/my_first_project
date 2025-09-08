// auth.js - Login/Register logic for CareerJobConnect
// Uses localStorage for mock user management
// Redirects based on role

document.addEventListener('DOMContentLoaded', function() {
    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            let users = JSON.parse(localStorage.getItem('cj_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                errorDiv.textContent = 'Invalid email or password.';
                return;
            }
            errorDiv.textContent = '';
            // Redirect based on role
            if (user.role === 'jobseeker') {
                window.location.href = 'dashboard-jobseeker.html';
            } else if (user.role === 'employer') {
                window.location.href = 'dashboard-employer.html';
            } else if (user.role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            }
        });
    }

    // --- FORGOT PASSWORD LOGIC ---
    const forgotLink = document.getElementById('forgot-link');
    const forgotModal = document.getElementById('forgot-modal');
    const closeForgotModal = document.getElementById('close-forgot-modal');
    const forgotForm = document.getElementById('forgot-form');
    const forgotMsg = document.getElementById('forgot-msg');
    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotModal.style.display = 'block';
        });
    }
    if (closeForgotModal && forgotModal) {
        closeForgotModal.addEventListener('click', function() {
            forgotModal.style.display = 'none';
            forgotMsg.textContent = '';
        });
    }
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            let users = JSON.parse(localStorage.getItem('cj_users') || '[]');
            if (!users.find(u => u.email === email)) {
                forgotMsg.textContent = 'Email not found.';
                return;
            }
            forgotMsg.textContent = '';
            alert('A password reset link has been sent to your email (demo).');
            forgotModal.style.display = 'none';
        });
    }

    // --- REGISTER LOGIC ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('register-role').value;
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const errorDiv = document.getElementById('register-error');
            if (!name || !email || !password) {
                errorDiv.textContent = 'Please fill in all fields.';
                return;
            }
            if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters.';
                return;
            }
            let users = JSON.parse(localStorage.getItem('cj_users') || '[]');
            if (users.find(u => u.email === email)) {
                errorDiv.textContent = 'Email already registered.';
                return;
            }
            users.push({ role, name, email, password });
            localStorage.setItem('cj_users', JSON.stringify(users));
            errorDiv.textContent = '';
            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html';
        });
    }
});
