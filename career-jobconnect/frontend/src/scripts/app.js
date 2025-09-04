document.addEventListener('DOMContentLoaded', function() {
    const jobList = document.getElementById('job-list');
    const locationFilter = document.getElementById('location-filter');
    const keywordSearch = document.getElementById('keyword-search');
    const categoryFilter = document.getElementById('category-filter');
    const salaryFilter = document.getElementById('salary-filter');
    const userAnalytics = document.getElementById('user-analytics');
    
    const jobs = [
        { title: 'Frontend Developer', company: 'Tech Solutions', location: 'Remote', category: 'Engineering', salary: 90000 },
        { title: 'Backend Engineer', company: 'InnovateX', location: 'New York, NY', category: 'Engineering', salary: 110000 },
        { title: 'UI/UX Designer', company: 'Creative Minds', location: 'San Francisco, CA', category: 'Design', salary: 85000 },
        { title: 'Product Manager', company: 'Visionary Inc.', location: 'Remote', category: 'Product', salary: 120000 },
        { title: 'QA Tester', company: 'QualityWorks', location: 'New York, NY', category: 'Engineering', salary: 70000 }
    ];
    function filterJobs() {
        let filtered = jobs;
        
        const loc = locationFilter ? locationFilter.value : 'all';
        if (loc !== 'all') filtered = filtered.filter(j => j.location === loc);
    
        const kw = keywordSearch ? keywordSearch.value.trim().toLowerCase() : '';
        if (kw) filtered = filtered.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw));
        
        const cat = categoryFilter ? categoryFilter.value : 'all';
        if (cat !== 'all') filtered = filtered.filter(j => j.category === cat);
        
        const sal = salaryFilter ? salaryFilter.value : 'all';
        if (sal !== 'all') {
            if (sal === '0-50000') filtered = filtered.filter(j => j.salary <= 50000);
            else if (sal === '50000-100000') filtered = filtered.filter(j => j.salary > 50000 && j.salary <= 100000);
            else if (sal === '100000+') filtered = filtered.filter(j => j.salary > 100000);
        }
        return filtered;
    }
    function renderJobs() {
        jobList.innerHTML = '';
        const filtered = filterJobs();
        filtered.forEach(job => {
            const jobDiv = document.createElement('div');
            jobDiv.className = 'job-item';
            jobDiv.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.company} - ${job.location} | ${job.category} | $${job.salary}</p>
                <button class="apply-btn">Apply Now</button>
            `;
            jobList.appendChild(jobDiv);
        });

        if (userAnalytics) {
            userAnalytics.innerHTML = `<strong>Jobs Found:</strong> ${filtered.length}`;
            userAnalytics.style.display = 'block';
        }
    }
    renderJobs();
    if (locationFilter) locationFilter.addEventListener('change', renderJobs);
    if (keywordSearch) keywordSearch.addEventListener('input', renderJobs);
    if (categoryFilter) categoryFilter.addEventListener('change', renderJobs);
    if (salaryFilter) salaryFilter.addEventListener('change', renderJobs);

    jobList.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            e.target.style.background = '#ffe082';
            e.target.style.color = '#0077cc';
        }
    });
    jobList.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            e.target.style.background = '';
            e.target.style.color = '';
        }
    });
    
    jobList.addEventListener('click', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            alert('Thank you for your interest! Application feature coming soon.');
        }
    });

    
    const postJobBtn = document.getElementById('post-job-btn');
    const employerLoginModal = document.getElementById('employer-login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const employerLoginForm = document.getElementById('employer-login-form');
    const companySection = document.getElementById('company');

    // Use postJobBtn for login modal
    if (postJobBtn) {
        postJobBtn.addEventListener('click', function() {
            // Show login modal instead of employerLoginModal
            if (document.getElementById('login-modal')) {
                document.getElementById('login-modal').style.display = 'block';
            } else if (employerLoginModal) {
                employerLoginModal.style.display = 'block';
            }
        });
    }
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', function() {
            if (document.getElementById('login-modal')) {
                document.getElementById('login-modal').style.display = 'none';
            }
            if (employerLoginModal) {
                employerLoginModal.style.display = 'none';
            }
        });
    }
    if (employerLoginForm) {
        employerLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Hide both modals
            if (document.getElementById('login-modal')) {
                document.getElementById('login-modal').style.display = 'none';
            }
            if (employerLoginModal) {
                employerLoginModal.style.display = 'none';
            }
            companySection.style.display = 'block';
            companySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Settings saved!');
        });
    }

    
    // Login modal logic
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('employer-login-form');
    const loginUsername = document.getElementById('employer-username');
    const loginPassword = document.getElementById('employer-password');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = loginUsername.value.trim();
            const password = loginPassword.value;
            let users = JSON.parse(localStorage.getItem('careerconnect_users') || '[]');
            const user = users.find(u => u.username === username && u.password === password && u.role === 'employer');
            if (user) {
                alert('Login successful! Redirecting to dashboard...');
                if (loginModal) loginModal.style.display = 'none';
                document.getElementById('company').style.display = 'block';
                document.getElementById('profile').style.display = 'none';
                document.getElementById('home').style.display = 'none';
            } else {
                alert('Invalid credentials or not registered as employer.');
            }
        });
    }


    // Registration modal logic
    const registerBtn = document.getElementById('register-btn');
    const registerModal = document.getElementById('register-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const registerForm = document.getElementById('register-form');
    const registerRole = document.getElementById('register-role');
    const employerExtraFields = document.getElementById('employer-extra-fields');
    const registerPassword = document.getElementById('register-password');

    // Password strength indicator
    let passwordStrengthSpan = document.getElementById('register-password-strength');
    if (!passwordStrengthSpan && registerPassword) {
        passwordStrengthSpan = document.createElement('span');
        passwordStrengthSpan.id = 'register-password-strength';
        registerPassword.parentNode.insertBefore(passwordStrengthSpan, registerPassword.nextSibling);
    }
    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            const val = registerPassword.value;
            let strength = 'Weak';
            if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val)) {
                strength = 'Strong';
            } else if (val.length >= 6 && /[A-Z]/.test(val) && /[0-9]/.test(val)) {
                strength = 'Medium';
            }
            passwordStrengthSpan.textContent = `Password Strength: ${strength}`;
            passwordStrengthSpan.style.marginLeft = '1rem';
            passwordStrengthSpan.style.color = strength === 'Strong' ? 'green' : (strength === 'Medium' ? 'orange' : 'red');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            registerModal.style.display = 'block';
        });
    }
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }
    if (registerRole) {
        registerRole.addEventListener('change', function() {
            if (this.value === 'employer') {
                employerExtraFields.style.display = 'block';
            } else {
                employerExtraFields.style.display = 'none';
            }
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Validate required fields
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = registerPassword.value;
            const role = registerRole.value;
            let valid = true;
            let errorMsg = '';
            if (!username || !email || !password) {
                valid = false;
                errorMsg = 'Please fill in all required fields.';
            }
            let userObj = { username, email, password, role };
            if (role === 'employer') {
                const company = document.getElementById('register-company').value.trim();
                const companyLocation = document.getElementById('register-company-location').value.trim();
                if (!company || !companyLocation) {
                    valid = false;
                    errorMsg = 'Please fill in all employer fields.';
                }
                userObj.company = company;
                userObj.companyLocation = companyLocation;
            }
            if (password.length < 6) {
                valid = false;
                errorMsg = 'Password must be at least 6 characters.';
            }
            if (!valid) {
                alert(errorMsg);
                return;
            }
            // Store user in localStorage
            let users = JSON.parse(localStorage.getItem('careerconnect_users') || '[]');
            users.push(userObj);
            localStorage.setItem('careerconnect_users', JSON.stringify(users));
            alert('Registration successful! Redirecting to dashboard...');
            registerModal.style.display = 'none';
            // Redirect to dashboard (simulate)
            if (role === 'employer') {
                document.getElementById('company').style.display = 'block';
                document.getElementById('profile').style.display = 'none';
                document.getElementById('home').style.display = 'none';
            } else {
                document.getElementById('profile').style.display = 'block';
                document.getElementById('company').style.display = 'none';
                document.getElementById('home').style.display = 'none';
            }
        });
    }
});
