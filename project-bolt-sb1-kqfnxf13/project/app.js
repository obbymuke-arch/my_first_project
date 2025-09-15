// Application State
let currentUser = null;
let currentPage = 'home';
let jobs = [];
let companies = [];
let users = [];
let applications = [];
let savedJobs = [];
let currentJobsPage = 1;
const jobsPerPage = 10;

// Mock Data
const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        type: "full-time",
        category: "technology",
        experience: "senior",
        salary: "$120,000 - $160,000",
        description: "We're looking for a Senior Frontend Developer to join our team and help build amazing user experiences. You'll work with React, TypeScript, and modern web technologies.",
        requirements: "5+ years of frontend development experience, Expert in React and TypeScript, Experience with modern CSS frameworks, Strong problem-solving skills",
        posted: new Date('2024-01-15'),
        featured: true,
        status: "active"
    },
    {
        id: 2,
        title: "Digital Marketing Manager",
        company: "GrowthLabs",
        location: "New York, NY",
        type: "full-time",
        category: "marketing",
        experience: "mid",
        salary: "$80,000 - $100,000",
        description: "Join our marketing team to drive growth through digital channels. You'll manage campaigns, analyze data, and optimize our marketing funnel.",
        requirements: "3+ years in digital marketing, Experience with Google Ads and Facebook Ads, Strong analytical skills, Bachelor's degree in Marketing or related field",
        posted: new Date('2024-01-14'),
        featured: true,
        status: "active"
    },
    {
        id: 3,
        title: "UX/UI Designer",
        company: "DesignStudio",
        location: "Austin, TX",
        type: "contract",
        category: "design",
        experience: "mid",
        salary: "$70 - $90 per hour",
        description: "We need a talented UX/UI Designer to help create intuitive and beautiful user interfaces for our client projects.",
        requirements: "3+ years of UX/UI design experience, Proficiency in Figma and Adobe Creative Suite, Strong portfolio demonstrating design thinking, Experience with user research",
        posted: new Date('2024-01-13'),
        featured: false,
        status: "active"
    },
    {
        id: 4,
        title: "Sales Representative",
        company: "SalesForce Pro",
        location: "Chicago, IL",
        type: "full-time",
        category: "sales",
        experience: "entry",
        salary: "$50,000 + Commission",
        description: "Join our sales team and help businesses grow with our CRM solutions. Great opportunity for career growth.",
        requirements: "1+ years in B2B sales, Strong communication skills, Goal-oriented mindset, Bachelor's degree preferred",
        posted: new Date('2024-01-12'),
        featured: false,
        status: "active"
    },
    {
        id: 5,
        title: "Financial Analyst",
        company: "FinanceHub",
        location: "Boston, MA",
        type: "full-time",
        category: "finance",
        experience: "mid",
        salary: "$75,000 - $95,000",
        description: "We're seeking a Financial Analyst to support our investment decisions and financial planning processes.",
        requirements: "3+ years in financial analysis, CFA or similar certification preferred, Advanced Excel skills, Strong analytical mindset",
        posted: new Date('2024-01-11'),
        featured: false,
        status: "active"
    },
    {
        id: 6,
        title: "Registered Nurse",
        company: "HealthCare Plus",
        location: "Los Angeles, CA",
        type: "full-time",
        category: "healthcare",
        experience: "mid",
        salary: "$85,000 - $105,000",
        description: "Join our healthcare team to provide exceptional patient care in our modern facility.",
        requirements: "Valid RN license, 2+ years of clinical experience, BLS certification, Strong interpersonal skills",
        posted: new Date('2024-01-10'),
        featured: true,
        status: "active"
    }
];

const mockCompanies = [
    {
        id: 1,
        name: "TechCorp",
        industry: "Technology",
        jobsPosted: 15,
        description: "Leading technology company focused on innovation and growth.",
        logo: "T",
        status: "active"
    },
    {
        id: 2,
        name: "GrowthLabs",
        industry: "Marketing",
        jobsPosted: 8,
        description: "Digital marketing agency helping businesses scale.",
        logo: "G",
        status: "active"
    },
    {
        id: 3,
        name: "DesignStudio",
        industry: "Design",
        jobsPosted: 12,
        description: "Creative design studio crafting beautiful experiences.",
        logo: "D",
        status: "active"
    },
    {
        id: 4,
        name: "SalesForce Pro",
        industry: "Software",
        jobsPosted: 20,
        description: "CRM solutions for modern businesses.",
        logo: "S",
        status: "active"
    },
    {
        id: 5,
        name: "FinanceHub",
        industry: "Finance",
        jobsPosted: 10,
        description: "Financial services and investment management.",
        logo: "F",
        status: "active"
    },
    {
        id: 6,
        name: "HealthCare Plus",
        industry: "Healthcare",
        jobsPosted: 25,
        description: "Comprehensive healthcare services provider.",
        logo: "H",
        status: "active"
    }
];

const mockUsers = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        type: "jobseeker",
        joined: new Date('2024-01-01'),
        status: "active"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@techcorp.com",
        type: "employer",
        joined: new Date('2024-01-02'),
        status: "active"
    },
    {
        id: 3,
        name: "Admin User",
        email: "admin@careerjobconnect.com",
        type: "admin",
        joined: new Date('2024-01-01'),
        status: "active"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    // Load data from localStorage or use mock data
    jobs = JSON.parse(localStorage.getItem('jobs')) || mockJobs;
    companies = JSON.parse(localStorage.getItem('companies')) || mockCompanies;
    users = JSON.parse(localStorage.getItem('users')) || mockUsers;
    applications = JSON.parse(localStorage.getItem('applications')) || [];
    savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    
    // Check for logged in user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
    
    // Show initial page
    showPage('home');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });

    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', performJobSearch);
    document.getElementById('job-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performJobSearch();
    });

    // Job filters
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('experience-filter').addEventListener('change', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);

    // Authentication forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('admin-login').addEventListener('click', handleAdminLogin);

    // Dashboard navigation
    document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id === 'logout-btn') {
                handleLogout();
            } else {
                showDashboardSection(item.dataset.section);
            }
        });
    });

    // Profile form
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);

    // Job form
    document.getElementById('job-form').addEventListener('submit', handleJobPost);

    // Modal
    document.getElementById('close-modal').addEventListener('click', closeJobModal);
    document.getElementById('job-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('job-modal')) {
            closeJobModal();
        }
    });
    document.getElementById('save-job').addEventListener('click', handleSaveJob);
    document.getElementById('apply-job').addEventListener('click', handleApplyJob);

    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showAdminTab(btn.dataset.tab);
        });
    });
}

function loadInitialData() {
    updateStats();
    renderFeaturedJobs();
    renderAllJobs();
    renderCompanies();
}

// Navigation Functions
function showPage(pageName) {
    currentPage = pageName;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show current page
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');
    
    // Close mobile menu
    document.getElementById('nav-menu').classList.remove('active');
    
    // Load page specific data
    switch(pageName) {
        case 'jobs':
            renderAllJobs();
            break;
        case 'companies':
            renderCompanies();
            break;
        case 'dashboard':
            if (currentUser) {
                renderDashboard();
            } else {
                showPage('login');
            }
            break;
    }
}

function showDashboardSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show current section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Load section specific data
    switch(sectionName) {
        case 'overview':
            renderDashboardOverview();
            break;
        case 'profile':
            renderUserProfile();
            break;
        case 'applications':
            renderUserApplications();
            break;
        case 'saved-jobs':
            renderSavedJobs();
            break;
        case 'manage-jobs':
            renderManageJobs();
            break;
        case 'admin':
            renderAdminPanel();
            break;
    }
}

function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Show tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load tab specific data
    switch(tabName) {
        case 'users':
            renderUsersTable();
            break;
        case 'jobs':
            renderJobsTable();
            break;
        case 'companies':
            renderCompaniesTable();
            break;
        case 'analytics':
            // Analytics data is static for demo
            break;
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple authentication - in real app, this would be server-side
    const user = users.find(u => u.email === email);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        showPage('dashboard');
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const type = document.getElementById('register-type').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already exists', 'error');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        type,
        joined: new Date(),
        status: 'active'
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateUIForLoggedInUser();
    showPage('dashboard');
    showNotification('Account created successfully!', 'success');
}

function handleAdminLogin(e) {
    e.preventDefault();
    // Quick admin login for demo
    currentUser = users.find(u => u.type === 'admin');
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    showPage('dashboard');
    showNotification('Admin login successful!', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
    showPage('home');
    showNotification('Logged out successfully!', 'success');
}

function updateUIForLoggedInUser() {
    const navAuth = document.querySelector('.nav-auth');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    const userAvatar = document.getElementById('user-avatar');
    
    if (currentUser) {
        navAuth.innerHTML = `
            <button class="btn btn-outline" data-page="dashboard">Dashboard</button>
            <button class="btn btn-primary" onclick="handleLogout()">Logout</button>
        `;
        
        userName.textContent = currentUser.name;
        userRole.textContent = currentUser.type.charAt(0).toUpperCase() + currentUser.type.slice(1);
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        
        // Show/hide role-specific elements
        const employerElements = document.querySelectorAll('.employer-only');
        const adminElements = document.querySelectorAll('.admin-only');
        
        if (currentUser.type === 'employer' || currentUser.type === 'admin') {
            employerElements.forEach(el => el.classList.add('show'));
        } else {
            employerElements.forEach(el => el.classList.remove('show'));
        }
        
        if (currentUser.type === 'admin') {
            adminElements.forEach(el => el.classList.add('show'));
        } else {
            adminElements.forEach(el => el.classList.remove('show'));
        }
        
        // Re-add event listeners for new buttons
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(link.dataset.page);
            });
        });
    } else {
        navAuth.innerHTML = `
            <button class="btn btn-outline" data-page="login">Login</button>
            <button class="btn btn-primary" data-page="register">Sign Up</button>
        `;
        
        // Re-add event listeners for new buttons
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showPage(link.dataset.page);
            });
        });
    }
}

// Job Functions
function renderFeaturedJobs() {
    const container = document.getElementById('featured-jobs-grid');
    const featuredJobs = jobs.filter(job => job.featured && job.status === 'active').slice(0, 6);
    
    container.innerHTML = featuredJobs.map(job => createJobCard(job)).join('');
}

function renderAllJobs() {
    const container = document.getElementById('jobs-list');
    const startIndex = (currentJobsPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const filteredJobs = getFilteredJobs();
    const pageJobs = filteredJobs.slice(startIndex, endIndex);
    
    container.innerHTML = pageJobs.map(job => createJobCard(job)).join('');
    
    renderPagination(filteredJobs.length);
}

function getFilteredJobs() {
    const categoryFilter = document.getElementById('category-filter').value;
    const experienceFilter = document.getElementById('experience-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const searchQuery = document.getElementById('job-search')?.value?.toLowerCase() || '';
    
    return jobs.filter(job => {
        const matchesCategory = !categoryFilter || job.category === categoryFilter;
        const matchesExperience = !experienceFilter || job.experience === experienceFilter;
        const matchesType = !typeFilter || job.type === typeFilter;
        const matchesSearch = !searchQuery || 
            job.title.toLowerCase().includes(searchQuery) ||
            job.company.toLowerCase().includes(searchQuery) ||
            job.location.toLowerCase().includes(searchQuery);
        
        return job.status === 'active' && matchesCategory && matchesExperience && matchesType && matchesSearch;
    });
}

function createJobCard(job) {
    const isLoggedIn = currentUser !== null;
    const isSaved = savedJobs.some(savedJob => savedJob.jobId === job.id && savedJob.userId === currentUser?.id);
    
    return `
        <div class="job-card" onclick="showJobModal(${job.id})">
            <h3>${job.title}</h3>
            <div class="job-company">${job.company}</div>
            <div class="job-meta">
                <span>${job.location}</span>
                <span>${job.type.replace('-', ' ')}</span>
                <span>${job.experience} level</span>
                <span>${job.salary}</span>
            </div>
            <div class="job-description">
                ${job.description.substring(0, 150)}...
            </div>
            <div class="job-actions" onclick="event.stopPropagation()">
                ${isLoggedIn ? `
                    <button class="btn ${isSaved ? 'btn-primary' : 'btn-outline'}" onclick="toggleSaveJob(${job.id})">
                        ${isSaved ? 'Saved' : 'Save Job'}
                    </button>
                    <button class="btn btn-primary" onclick="showJobModal(${job.id})">
                        View Details
                    </button>
                ` : `
                    <button class="btn btn-outline" onclick="showPage('login')">
                        Login to Save
                    </button>
                    <button class="btn btn-primary" onclick="showJobModal(${job.id})">
                        View Details
                    </button>
                `}
            </div>
        </div>
    `;
}

function showJobModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    document.getElementById('modal-job-title').textContent = job.title;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-location').textContent = job.location;
    document.getElementById('modal-type').textContent = job.type.replace('-', ' ');
    document.getElementById('modal-salary').textContent = job.salary;
    document.getElementById('modal-description').textContent = job.description;
    document.getElementById('modal-requirements').textContent = job.requirements;
    
    const saveBtn = document.getElementById('save-job');
    const applyBtn = document.getElementById('apply-job');
    
    if (currentUser) {
        const isSaved = savedJobs.some(savedJob => savedJob.jobId === job.id && savedJob.userId === currentUser.id);
        saveBtn.textContent = isSaved ? 'Saved' : 'Save Job';
        saveBtn.onclick = () => toggleSaveJob(jobId);
        applyBtn.onclick = () => applyToJob(jobId);
    } else {
        saveBtn.textContent = 'Login to Save';
        saveBtn.onclick = () => showPage('login');
        applyBtn.textContent = 'Login to Apply';
        applyBtn.onclick = () => showPage('login');
    }
    
    document.getElementById('job-modal').classList.add('active');
}

function closeJobModal() {
    document.getElementById('job-modal').classList.remove('active');
}

function toggleSaveJob(jobId) {
    if (!currentUser) {
        showPage('login');
        return;
    }
    
    const existingIndex = savedJobs.findIndex(
        savedJob => savedJob.jobId === jobId && savedJob.userId === currentUser.id
    );
    
    if (existingIndex >= 0) {
        savedJobs.splice(existingIndex, 1);
        showNotification('Job removed from saved jobs', 'success');
    } else {
        savedJobs.push({
            id: savedJobs.length + 1,
            jobId,
            userId: currentUser.id,
            savedAt: new Date()
        });
        showNotification('Job saved successfully!', 'success');
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    renderFeaturedJobs();
    renderAllJobs();
    
    // Update modal button
    const saveBtn = document.getElementById('save-job');
    const isSaved = savedJobs.some(savedJob => savedJob.jobId === jobId && savedJob.userId === currentUser.id);
    saveBtn.textContent = isSaved ? 'Saved' : 'Save Job';
}

function applyToJob(jobId) {
    if (!currentUser) {
        showPage('login');
        return;
    }
    
    const existingApplication = applications.find(
        app => app.jobId === jobId && app.userId === currentUser.id
    );
    
    if (existingApplication) {
        showNotification('You have already applied to this job', 'warning');
        return;
    }
    
    applications.push({
        id: applications.length + 1,
        jobId,
        userId: currentUser.id,
        appliedAt: new Date(),
        status: 'pending'
    });
    
    localStorage.setItem('applications', JSON.stringify(applications));
    showNotification('Application submitted successfully!', 'success');
    closeJobModal();
}

function handleSaveJob() {
    // This is handled by the onclick event set in showJobModal
}

function handleApplyJob() {
    // This is handled by the onclick event set in showJobModal
}

function performJobSearch() {
    currentJobsPage = 1;
    renderAllJobs();
}

function applyFilters() {
    currentJobsPage = 1;
    renderAllJobs();
}

function clearFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('experience-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('job-search').value = '';
    document.getElementById('location-search').value = '';
    applyFilters();
}

function renderPagination(totalJobs) {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    if (currentJobsPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentJobsPage - 1})">Previous</button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentJobsPage) {
            paginationHTML += `<button class="active">${i}</button>`;
        } else if (i === 1 || i === totalPages || (i >= currentJobsPage - 2 && i <= currentJobsPage + 2)) {
            paginationHTML += `<button onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentJobsPage - 3 || i === currentJobsPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    if (currentJobsPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentJobsPage + 1})">Next</button>`;
    }
    
    container.innerHTML = paginationHTML;
}

function changePage(page) {
    currentJobsPage = page;
    renderAllJobs();
}

// Company Functions
function renderCompanies() {
    const container = document.getElementById('companies-grid');
    container.innerHTML = companies.map(company => createCompanyCard(company)).join('');
}

function createCompanyCard(company) {
    return `
        <div class="company-card">
            <div class="company-logo">${company.logo}</div>
            <h3>${company.name}</h3>
            <div class="company-info">
                <p>${company.industry}</p>
                <p>${company.jobsPosted} jobs posted</p>
                <p>${company.description}</p>
            </div>
            <button class="btn btn-primary" onclick="searchJobsByCompany('${company.name}')">
                View Jobs
            </button>
        </div>
    `;
}

function searchJobsByCompany(companyName) {
    document.getElementById('job-search').value = companyName;
    showPage('jobs');
    performJobSearch();
}

// Dashboard Functions
function renderDashboard() {
    showDashboardSection('overview');
}

function renderDashboardOverview() {
    if (!currentUser) return;
    
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    const userSavedJobs = savedJobs.filter(saved => saved.userId === currentUser.id);
    const userPostedJobs = jobs.filter(job => job.employerId === currentUser.id);
    
    document.getElementById('applied-jobs-count').textContent = userApplications.length;
    document.getElementById('saved-jobs-count').textContent = userSavedJobs.length;
    document.getElementById('profile-views').textContent = Math.floor(Math.random() * 100) + 50;
    
    if (currentUser.type === 'employer') {
        document.getElementById('posted-jobs-count').textContent = userPostedJobs.length;
    }
    
    // Render recent activity
    renderRecentActivity();
}

function renderRecentActivity() {
    const container = document.getElementById('activity-list');
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    const userSavedJobs = savedJobs.filter(saved => saved.userId === currentUser.id);
    
    const activities = [];
    
    userApplications.slice(-5).forEach(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (job) {
            activities.push({
                title: `Applied to ${job.title}`,
                description: `at ${job.company}`,
                date: app.appliedAt
            });
        }
    });
    
    userSavedJobs.slice(-3).forEach(saved => {
        const job = jobs.find(j => j.id === saved.jobId);
        if (job) {
            activities.push({
                title: `Saved ${job.title}`,
                description: `at ${job.company}`,
                date: saved.savedAt
            });
        }
    });
    
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
        </div>
    `).join('');
}

function renderUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-location').value = currentUser.location || '';
    document.getElementById('profile-title').value = currentUser.title || '';
    document.getElementById('profile-bio').value = currentUser.bio || '';
    document.getElementById('profile-skills').value = currentUser.skills || '';
}

function handleProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;
    
    const updatedUser = {
        ...currentUser,
        name: document.getElementById('profile-name').value,
        email: document.getElementById('profile-email').value,
        phone: document.getElementById('profile-phone').value,
        location: document.getElementById('profile-location').value,
        title: document.getElementById('profile-title').value,
        bio: document.getElementById('profile-bio').value,
        skills: document.getElementById('profile-skills').value
    };
    
    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    currentUser = updatedUser;
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update UI
    document.getElementById('user-name').textContent = updatedUser.name;
    
    showNotification('Profile updated successfully!', 'success');
}

function renderUserApplications() {
    if (!currentUser) return;
    
    const container = document.getElementById('applications-list');
    const userApplications = applications.filter(app => app.userId === currentUser.id);
    
    if (userApplications.length === 0) {
        container.innerHTML = '<p>You haven\'t applied to any jobs yet.</p>';
        return;
    }
    
    container.innerHTML = userApplications.map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        if (!job) return '';
        
        return `
            <div class="application-item">
                <div class="application-header">
                    <div class="application-info">
                        <h3>${job.title}</h3>
                        <p>${job.company} • ${job.location}</p>
                        <p>Applied: ${new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="application-status status-${app.status}">
                        ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderSavedJobs() {
    if (!currentUser) return;
    
    const container = document.getElementById('saved-jobs-list');
    const userSavedJobs = savedJobs.filter(saved => saved.userId === currentUser.id);
    
    if (userSavedJobs.length === 0) {
        container.innerHTML = '<p>You haven\'t saved any jobs yet.</p>';
        return;
    }
    
    container.innerHTML = userSavedJobs.map(saved => {
        const job = jobs.find(j => j.id === saved.jobId);
        if (!job) return '';
        
        return `
            <div class="saved-job-item">
                <div class="saved-job-header">
                    <div class="saved-job-info">
                        <h3>${job.title}</h3>
                        <p>${job.company} • ${job.location}</p>
                        <p>Saved: ${new Date(saved.savedAt).toLocaleDateString()}</p>
                    </div>
                    <div class="saved-job-actions">
                        <button class="btn btn-outline" onclick="toggleSaveJob(${job.id})">Remove</button>
                        <button class="btn btn-primary" onclick="showJobModal(${job.id})">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function handleJobPost(e) {
    e.preventDefault();
    if (!currentUser || (currentUser.type !== 'employer' && currentUser.type !== 'admin')) return;
    
    const newJob = {
        id: jobs.length + 1,
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        category: document.getElementById('job-category').value,
        type: document.getElementById('job-type').value,
        experience: document.getElementById('job-experience').value,
        salary: document.getElementById('job-salary').value,
        description: document.getElementById('job-description').value,
        requirements: document.getElementById('job-requirements').value,
        posted: new Date(),
        employerId: currentUser.id,
        featured: false,
        status: 'active'
    };
    
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    // Clear form
    document.getElementById('job-form').reset();
    
    showNotification('Job posted successfully!', 'success');
    renderManageJobs();
}

function renderManageJobs() {
    if (!currentUser || (currentUser.type !== 'employer' && currentUser.type !== 'admin')) return;
    
    const container = document.getElementById('manage-jobs-list');
    const userJobs = jobs.filter(job => job.employerId === currentUser.id);
    
    if (userJobs.length === 0) {
        container.innerHTML = '<p>You haven\'t posted any jobs yet.</p>';
        return;
    }
    
    container.innerHTML = userJobs.map(job => `
        <div class="manage-job-item">
            <div class="manage-job-header">
                <div class="manage-job-info">
                    <h3>${job.title}</h3>
                    <p>${job.company} • ${job.location}</p>
                    <p>Posted: ${new Date(job.posted).toLocaleDateString()}</p>
                    <p>Status: ${job.status}</p>
                </div>
                <div class="manage-job-actions">
                    <button class="btn btn-outline" onclick="editJob(${job.id})">Edit</button>
                    <button class="btn btn-primary" onclick="toggleJobStatus(${job.id})">
                        ${job.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline" onclick="deleteJob(${job.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editJob(jobId) {
    // For demo purposes, we'll just show a notification
    showNotification('Job edit functionality would be implemented here', 'info');
}

function toggleJobStatus(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.status = job.status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('jobs', JSON.stringify(jobs));
        renderManageJobs();
        showNotification(`Job ${job.status === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        jobs = jobs.filter(j => j.id !== jobId);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        renderManageJobs();
        showNotification('Job deleted successfully!', 'success');
    }
}

// Admin Functions
function renderAdminPanel() {
    if (!currentUser || currentUser.type !== 'admin') return;
    
    renderUsersTable();
    updateAdminStats();
}

function updateAdminStats() {
    document.getElementById('total-users-admin').textContent = users.length;
    document.getElementById('new-users-today').textContent = users.filter(
        u => new Date(u.joined).toDateString() === new Date().toDateString()
    ).length;
    document.getElementById('active-users').textContent = users.filter(u => u.status === 'active').length;
    
    document.getElementById('total-jobs-admin').textContent = jobs.length;
    document.getElementById('active-jobs-admin').textContent = jobs.filter(j => j.status === 'active').length;
    document.getElementById('pending-jobs').textContent = jobs.filter(j => j.status === 'pending').length;
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.type.charAt(0).toUpperCase() + user.type.slice(1)}</td>
            <td>${new Date(user.joined).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline" onclick="toggleUserStatus(${user.id})">
                        ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderJobsTable() {
    const tbody = document.getElementById('admin-jobs-table-body');
    tbody.innerHTML = jobs.map(job => `
        <tr>
            <td>${job.title}</td>
            <td>${job.company}</td>
            <td>${job.category}</td>
            <td>${new Date(job.posted).toLocaleDateString()}</td>
            <td>${job.status}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline" onclick="toggleJobStatus(${job.id})">
                        ${job.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline" onclick="deleteJob(${job.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderCompaniesTable() {
    const tbody = document.getElementById('admin-companies-table-body');
    tbody.innerHTML = companies.map(company => `
        <tr>
            <td>${company.name}</td>
            <td>${company.industry}</td>
            <td>${company.jobsPosted}</td>
            <td>${company.status}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline" onclick="toggleCompanyStatus(${company.id})">
                        ${company.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline" onclick="deleteCompany(${company.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('users', JSON.stringify(users));
        renderUsersTable();
        updateAdminStats();
        showNotification(`User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsersTable();
        updateAdminStats();
        showNotification('User deleted successfully!', 'success');
    }
}

function toggleCompanyStatus(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        company.status = company.status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('companies', JSON.stringify(companies));
        renderCompaniesTable();
        showNotification(`Company ${company.status === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
}

function deleteCompany(companyId) {
    if (confirm('Are you sure you want to delete this company?')) {
        companies = companies.filter(c => c.id !== companyId);
        localStorage.setItem('companies', JSON.stringify(companies));
        renderCompaniesTable();
        showNotification('Company deleted successfully!', 'success');
    }
}

// Utility Functions
function updateStats() {
    document.getElementById('total-jobs').textContent = jobs.filter(j => j.status === 'active').length;
    document.getElementById('total-companies').textContent = companies.filter(c => c.status === 'active').length;
    document.getElementById('total-users').textContent = users.filter(u => u.status === 'active').length;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Global functions for onclick handlers
window.showJobModal = showJobModal;
window.toggleSaveJob = toggleSaveJob;
window.applyToJob = applyToJob;
window.searchJobsByCompany = searchJobsByCompany;
window.changePage = changePage;
window.showPage = showPage;
window.editJob = editJob;
window.toggleJobStatus = toggleJobStatus;
window.deleteJob = deleteJob;
window.toggleUserStatus = toggleUserStatus;
window.deleteUser = deleteUser;
window.toggleCompanyStatus = toggleCompanyStatus;
window.deleteCompany = deleteCompany;
window.handleLogout = handleLogout;