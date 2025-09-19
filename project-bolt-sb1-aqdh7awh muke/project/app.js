// Application State
const AppState = {
  currentUser: null,
  currentPage: 'home',
  jobs: [],
  companies: [],
  users: [],
  applications: [],
  savedJobs: [],
  currentJobPage: 1,
  jobsPerPage: 5
};

// Sample Data
const sampleJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    category: "technology",
    experience: "senior",
    salary: "$120,000 - $150,000",
    description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern tools. You'll work on user-facing features that impact millions of users worldwide.",
    requirements: "5+ years of React experience, TypeScript proficiency, experience with state management libraries, strong CSS skills.",
    status: "active",
    posted: "2024-01-15",
    featured: true
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Full-time",
    category: "design",
    experience: "mid",
    salary: "$80,000 - $100,000",
    description: "Create beautiful and intuitive user experiences for our client projects. Work closely with developers and stakeholders to deliver exceptional digital products.",
    requirements: "3+ years of UX design experience, proficiency in Figma, user research skills, portfolio required.",
    status: "active",
    posted: "2024-01-14",
    featured: true
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Remote",
    type: "Remote",
    category: "marketing",
    experience: "mid",
    salary: "$70,000 - $90,000",
    description: "Lead our digital marketing initiatives and drive growth through innovative campaigns. Manage social media, content marketing, and paid advertising strategies.",
    requirements: "4+ years marketing experience, Google Ads certification, social media expertise, analytical mindset.",
    status: "active",
    posted: "2024-01-13",
    featured: true
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "DataFlow",
    location: "Austin, TX",
    type: "Full-time",
    category: "technology",
    experience: "entry",
    salary: "$55,000 - $70,000",
    description: "Analyze large datasets to provide insights that drive business decisions. Work with SQL, Python, and visualization tools to create meaningful reports.",
    requirements: "SQL proficiency, Python or R experience, statistical analysis skills, bachelor's degree in related field.",
    status: "active",
    posted: "2024-01-12",
    featured: false
  },
  {
    id: 5,
    title: "Sales Representative",
    company: "SalesForce Pro",
    location: "Chicago, IL",
    type: "Full-time",
    category: "sales",
    experience: "entry",
    salary: "$45,000 - $65,000 + Commission",
    description: "Drive revenue growth by building relationships with clients and closing deals. Great opportunity for career growth in a supportive environment.",
    requirements: "Excellent communication skills, CRM experience preferred, self-motivated, bachelor's degree preferred.",
    status: "active",
    posted: "2024-01-11",
    featured: false
  }
];

const sampleCompanies = [
  {
    id: 1,
    name: "TechCorp",
    industry: "Technology",
    description: "Leading technology company specializing in web applications",
    jobCount: 15,
    status: "active"
  },
  {
    id: 2,
    name: "DesignStudio",
    industry: "Design",
    description: "Creative design agency serving Fortune 500 clients",
    jobCount: 8,
    status: "active"
  },
  {
    id: 3,
    name: "GrowthCo",
    industry: "Marketing",
    description: "Digital marketing agency focused on startup growth",
    jobCount: 12,
    status: "active"
  },
  {
    id: 4,
    name: "DataFlow",
    industry: "Technology",
    description: "Data analytics and business intelligence solutions",
    jobCount: 6,
    status: "active"
  }
];

const sampleUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    type: "jobseeker",
    status: "active",
    joined: "2024-01-01",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY",
    info: "Experienced frontend developer with 5 years in React"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    type: "employer",
    status: "active",
    joined: "2024-01-05",
    phone: "+1 (555) 987-6543",
    address: "456 Business Ave, San Francisco, CA",
    info: "HR Manager at TechCorp, recruiting top talent"
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@careerjobconnect.com",
    type: "admin",
    status: "active",
    joined: "2023-12-01",
    phone: "+1 (555) 555-5555",
    address: "789 Admin Blvd, Seattle, WA",
    info: "System administrator managing the platform"
  }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Load sample data
  AppState.jobs = [...sampleJobs];
  AppState.companies = [...sampleCompanies];
  AppState.users = [...sampleUsers];
  
  // Set up event listeners
  setupEventListeners();
  
  // Load initial page
  showPage('home');
  
  // Load initial data
  loadFeaturedJobs();
  loadCompanies();
  updateStats();
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.getAttribute('data-page') || e.target.closest('[data-page]').getAttribute('data-page');
      showPage(page);
    });
  });

  // Mobile navigation
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  // Job search inputs
  const jobSearch = document.getElementById('job-search');
  const locationSearch = document.getElementById('location-search');
  
  if (jobSearch) {
    jobSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
  
  if (locationSearch) {
    locationSearch.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  // Auth forms
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Dashboard navigation
  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.getAttribute('data-section') || e.target.closest('[data-section]').getAttribute('data-section');
      showDashboardSection(section);
    });
  });

  // Admin tabs
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.getAttribute('data-tab');
      showAdminTab(tabName);
    });
  });

  // Job filters
  const categoryFilter = document.getElementById('category-filter');
  const experienceFilter = document.getElementById('experience-filter');
  const typeFilter = document.getElementById('type-filter');
  const clearFilters = document.getElementById('clear-filters');

  if (categoryFilter) categoryFilter.addEventListener('change', applyJobFilters);
  if (experienceFilter) experienceFilter.addEventListener('change', applyJobFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyJobFilters);
  if (clearFilters) clearFilters.addEventListener('click', clearJobFilters);

  // Profile form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }

  // Job posting form
  const jobForm = document.getElementById('job-form');
  if (jobForm) {
    jobForm.addEventListener('submit', handleJobPost);
  }

  // Modal close functionality
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeModal);
  });

  // Click outside modal to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });

  // Dashboard button
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => showPage('dashboard'));
  }

  // Logout buttons
  const logoutBtn = document.getElementById('logout-btn');
  const logoutNavBtn = document.getElementById('logout-nav-btn');
  
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (logoutNavBtn) logoutNavBtn.addEventListener('click', handleLogout);

  // Admin login
  const adminLogin = document.getElementById('admin-login');
  if (adminLogin) {
    adminLogin.addEventListener('click', (e) => {
      e.preventDefault();
      // Auto-fill admin credentials for demo
      document.getElementById('login-email').value = 'admin@careerjobconnect.com';
      document.getElementById('login-password').value = 'admin123';
    });
  }

  // User management forms
  const addUserForm = document.getElementById('add-user-form');
  if (addUserForm) {
    addUserForm.addEventListener('submit', handleAddUser);
  }

  const editUserForm = document.getElementById('edit-user-form');
  if (editUserForm) {
    editUserForm.addEventListener('submit', handleEditUser);
  }
}

// Page Navigation
function showPage(pageName) {
  // Update current page
  AppState.currentPage = pageName;
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show target page
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeLink = document.querySelector(`[data-page="${pageName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Load page-specific data
  switch(pageName) {
    case 'jobs':
      loadJobsPage();
      break;
    case 'companies':
      loadCompanies();
      break;
    case 'dashboard':
      if (AppState.currentUser) {
        loadDashboard();
      } else {
        showPage('login');
      }
      break;
  }
  
  // Close mobile menu
  const navMenu = document.getElementById('nav-menu');
  if (navMenu) {
    navMenu.classList.remove('active');
  }
}

// Authentication
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Simple authentication (in a real app, this would be server-side)
  const user = AppState.users.find(u => u.email === email);
  
  if (user) {
    AppState.currentUser = user;
    updateUserInterface();
    showPage('dashboard');
    showNotification('Login successful!', 'success');
  } else {
    showNotification('Invalid credentials. Try admin@careerjobconnect.com with password admin123', 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const type = document.getElementById('register-type').value;
  const termsAgreed = document.getElementById('terms-agreement').checked;
  
  // Validation
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  if (!termsAgreed) {
    showNotification('Please agree to the terms and conditions', 'error');
    return;
  }
  
  if (AppState.users.find(u => u.email === email)) {
    showNotification('Email already exists', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: AppState.users.length + 1,
    name: name,
    email: email,
    type: type,
    status: 'active',
    joined: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
    info: ''
  };
  
  AppState.users.push(newUser);
  AppState.currentUser = newUser;
  
  updateUserInterface();
  showPage('dashboard');
  showNotification('Account created successfully!', 'success');
}

function handleLogout() {
  AppState.currentUser = null;
  updateUserInterface();
  showPage('home');
  showNotification('Logged out successfully', 'success');
}

function updateUserInterface() {
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');
  
  if (AppState.currentUser) {
    // Show user menu, hide auth buttons
    if (navAuth) navAuth.style.display = 'none';
    if (navUser) navUser.style.display = 'flex';
    
    // Update user info in dashboard
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    
    if (userAvatar) userAvatar.textContent = AppState.currentUser.name.charAt(0).toUpperCase();
    if (userName) userName.textContent = AppState.currentUser.name;
    if (userRole) userRole.textContent = AppState.currentUser.type.charAt(0).toUpperCase() + AppState.currentUser.type.slice(1);
    
    // Update body class for role-based visibility
    document.body.className = `user-${AppState.currentUser.type}`;
  } else {
    // Show auth buttons, hide user menu
    if (navAuth) navAuth.style.display = 'flex';
    if (navUser) navUser.style.display = 'none';
    
    // Reset body class
    document.body.className = '';
  }
}

// Job Management
function loadFeaturedJobs() {
  const featuredJobsGrid = document.getElementById('featured-jobs-grid');
  if (!featuredJobsGrid) return;
  
  const featuredJobs = AppState.jobs.filter(job => job.featured);
  
  featuredJobsGrid.innerHTML = '';
  featuredJobs.forEach(job => {
    const jobCard = createJobCard(job);
    featuredJobsGrid.appendChild(jobCard);
  });
}

function loadJobsPage() {
  loadJobs(1);
}

function loadJobs(page = 1) {
  const jobsList = document.getElementById('jobs-list');
  if (!jobsList) return;
  
  AppState.currentJobPage = page;
  
  // Apply filters
  let filteredJobs = [...AppState.jobs];
  
  const categoryFilter = document.getElementById('category-filter')?.value;
  const experienceFilter = document.getElementById('experience-filter')?.value;
  const typeFilter = document.getElementById('type-filter')?.value;
  
  if (categoryFilter) {
    filteredJobs = filteredJobs.filter(job => job.category === categoryFilter);
  }
  
  if (experienceFilter) {
    filteredJobs = filteredJobs.filter(job => job.experience === experienceFilter);
  }
  
  if (typeFilter) {
    filteredJobs = filteredJobs.filter(job => job.type.toLowerCase().replace(' ', '-') === typeFilter);
  }
  
  // Pagination
  const startIndex = (page - 1) * AppState.jobsPerPage;
  const endIndex = startIndex + AppState.jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  // Display jobs
  jobsList.innerHTML = '';
  paginatedJobs.forEach(job => {
    const jobCard = createJobCard(job, true);
    jobsList.appendChild(jobCard);
  });
  
  // Update pagination
  updatePagination(filteredJobs.length, page);
}

function createJobCard(job, showActions = false) {
  const card = document.createElement('div');
  card.className = 'job-card';
  card.innerHTML = `
    <h3>${job.title}</h3>
    <div class="job-meta">
      <span class="company">${job.company}</span>
      <span class="location">${job.location}</span>
      <span class="job-type">${job.type}</span>
      <span class="salary">${job.salary}</span>
    </div>
    <p class="job-description">${job.description}</p>
    ${showActions ? `
      <div class="job-actions">
        <button class="btn btn-outline btn-sm" onclick="saveJob(${job.id})">Save</button>
        <button class="btn btn-primary btn-sm" onclick="showJobModal(${job.id})">View Details</button>
      </div>
    ` : ''}
  `;
  
  card.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      showJobModal(job.id);
    }
  });
  
  return card;
}

function showJobModal(jobId) {
  const job = AppState.jobs.find(j => j.id === jobId);
  if (!job) return;
  
  const modal = document.getElementById('job-modal');
  if (!modal) return;
  
  // Populate modal
  document.getElementById('modal-job-title').textContent = job.title;
  document.getElementById('modal-company').textContent = job.company;
  document.getElementById('modal-location').textContent = job.location;
  document.getElementById('modal-type').textContent = job.type;
  document.getElementById('modal-salary').textContent = job.salary;
  document.getElementById('modal-description').textContent = job.description;
  document.getElementById('modal-requirements').textContent = job.requirements;
  
  // Set up action buttons
  const saveBtn = document.getElementById('save-job');
  const applyBtn = document.getElementById('apply-job');
  
  if (saveBtn) {
    saveBtn.onclick = () => saveJob(jobId);
  }
  if (applyBtn) {
    if (AppState.currentUser && AppState.currentUser.type === 'admin') {
      applyBtn.style.display = 'none';
    } else {
      applyBtn.style.display = '';
      applyBtn.onclick = () => applyToJob(jobId);
    }
  }
  modal.classList.add('show');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
  });
}

function saveJob(jobId) {
  if (!AppState.currentUser) {
    showNotification('Please login to save jobs', 'warning');
    return;
  }
  
  const job = AppState.jobs.find(j => j.id === jobId);
  if (!job) return;
  
  if (!AppState.savedJobs.find(sj => sj.jobId === jobId && sj.userId === AppState.currentUser.id)) {
    AppState.savedJobs.push({
      id: AppState.savedJobs.length + 1,
      userId: AppState.currentUser.id,
      jobId: jobId,
      savedDate: new Date().toISOString().split('T')[0]
    });
    
    showNotification('Job saved successfully!', 'success');
  } else {
    showNotification('Job already saved', 'warning');
  }
}

function applyToJob(jobId) {
  if (!AppState.currentUser) {
    showNotification('Please login to apply for jobs', 'warning');
    return;
  }
  if (AppState.currentUser.type === 'admin') {
    showNotification('Admins are not allowed to apply for jobs.', 'error');
    return;
  }
  const job = AppState.jobs.find(j => j.id === jobId);
  if (!job) return;
  if (!AppState.applications.find(app => app.jobId === jobId && app.userId === AppState.currentUser.id)) {
    AppState.applications.push({
      id: AppState.applications.length + 1,
      userId: AppState.currentUser.id,
      jobId: jobId,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    });
    closeModal();
    showNotification('Application submitted successfully!', 'success');
  } else {
    showNotification('You have already applied for this job', 'warning');
  }
}

function performSearch() {
  const jobSearch = document.getElementById('job-search')?.value.toLowerCase() || '';
  const locationSearch = document.getElementById('location-search')?.value.toLowerCase() || '';
  
  // Filter jobs based on search criteria
  let searchResults = AppState.jobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(jobSearch);
    const companyMatch = job.company.toLowerCase().includes(jobSearch);
    const locationMatch = job.location.toLowerCase().includes(locationSearch);
    
    return (titleMatch || companyMatch) && locationMatch;
  });
  
  // If we're not on the jobs page, go there first
  if (AppState.currentPage !== 'jobs') {
    showPage('jobs');
  }
  
  // Display search results
  const jobsList = document.getElementById('jobs-list');
  if (jobsList) {
    jobsList.innerHTML = '';
    
    if (searchResults.length === 0) {
      jobsList.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
    } else {
      searchResults.forEach(job => {
        const jobCard = createJobCard(job, true);
        jobsList.appendChild(jobCard);
      });
    }
  }
}

function applyJobFilters() {
  loadJobs(1);
}

function clearJobFilters() {
  document.getElementById('category-filter').value = '';
  document.getElementById('experience-filter').value = '';
  document.getElementById('type-filter').value = '';
  loadJobs(1);
}

function updatePagination(totalJobs, currentPage) {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  
  const totalPages = Math.ceil(totalJobs / AppState.jobsPerPage);
  
  pagination.innerHTML = '';
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => loadJobs(currentPage - 1));
  pagination.appendChild(prevBtn);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.toggle('active', i === currentPage);
    pageBtn.addEventListener('click', () => loadJobs(i));
    pagination.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => loadJobs(currentPage + 1));
  pagination.appendChild(nextBtn);
}

// Company Management
function loadCompanies() {
  const companiesGrid = document.getElementById('companies-grid');
  if (!companiesGrid) return;
  
  companiesGrid.innerHTML = '';
  AppState.companies.forEach(company => {
    const companyCard = createCompanyCard(company);
    companiesGrid.appendChild(companyCard);
  });
}

function createCompanyCard(company) {
  const card = document.createElement('div');
  card.className = 'company-card';
  card.innerHTML = `
    <div class="company-logo">${company.name.charAt(0)}</div>
    <h3>${company.name}</h3>
    <p class="company-industry">${company.industry}</p>
    <p class="company-description">${company.description}</p>
    <div class="company-stats">
      <span>${company.jobCount} open positions</span>
    </div>
  `;
  return card;
}

// Dashboard Management
function loadDashboard() {
  if (!AppState.currentUser) return;
  
  showDashboardSection('overview');
  updateDashboardStats();
  loadDashboardData();
}

function showDashboardSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeItem = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
  }
  
  // Load section-specific data
  switch(sectionName) {
    case 'overview':
      loadRecentActivity();
      break;
    case 'profile':
      loadUserProfile();
      break;
    case 'applications':
      loadUserApplications();
      break;
    case 'saved-jobs':
      loadUserSavedJobs();
      break;
    case 'manage-jobs':
      loadEmployerJobs();
      break;
    case 'admin':
      loadAdminData();
      break;
  }
}

function updateDashboardStats() {
  if (!AppState.currentUser) return;
  
  const userId = AppState.currentUser.id;
  
  // Applications count
  const applicationsCount = AppState.applications.filter(app => app.userId === userId).length;
  const appliedJobsCount = document.getElementById('applied-jobs-count');
  if (appliedJobsCount) {
    appliedJobsCount.textContent = applicationsCount;
  }
  
  // Saved jobs count
  const savedJobsCount = AppState.savedJobs.filter(sj => sj.userId === userId).length;
  const savedJobsElement = document.getElementById('saved-jobs-count');
  if (savedJobsElement) {
    savedJobsElement.textContent = savedJobsCount;
  }
  
  // Profile views (mock data)
  const profileViews = document.getElementById('profile-views');
  if (profileViews) {
    profileViews.textContent = Math.floor(Math.random() * 100) + 50;
  }
  
  // Posted jobs count (for employers)
  if (AppState.currentUser.type === 'employer') {
    const postedJobsCount = AppState.jobs.filter(job => job.employerId === userId).length;
    const postedJobsElement = document.getElementById('posted-jobs-count');
    if (postedJobsElement) {
      postedJobsElement.textContent = postedJobsCount;
    }
  }
}

function loadRecentActivity() {
  const activityList = document.getElementById('activity-list');
  if (!activityList || !AppState.currentUser) return;
  
  const userId = AppState.currentUser.id;
  let activities = [];
  
  // Get recent applications
  AppState.applications
    .filter(app => app.userId === userId)
    .slice(-5)
    .forEach(app => {
      const job = AppState.jobs.find(j => j.id === app.jobId);
      if (job) {
        activities.push({
          type: 'application',
          date: app.appliedDate,
          description: `Applied for ${job.title} at ${job.company}`,
          icon: '📝'
        });
      }
    });
  
  // Get recent saved jobs
  AppState.savedJobs
    .filter(sj => sj.userId === userId)
    .slice(-3)
    .forEach(sj => {
      const job = AppState.jobs.find(j => j.id === sj.jobId);
      if (job) {
        activities.push({
          type: 'save',
          date: sj.savedDate,
          description: `Saved ${job.title} at ${job.company}`,
          icon: '💾'
        });
      }
    });
  
  // Sort by date
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  activityList.innerHTML = '';
  
  if (activities.length === 0) {
    activityList.innerHTML = '<div class="no-activity">No recent activity</div>';
    return;
  }
  
  activities.slice(0, 8).forEach(activity => {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-content">
        <h4>${activity.description}</h4>
        <p>${formatDate(activity.date)}</p>
      </div>
    `;
    activityList.appendChild(activityItem);
  });
}

function loadUserProfile() {
  if (!AppState.currentUser) return;
  
  const user = AppState.currentUser;
  
  // Fill profile form
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profilePhone = document.getElementById('profile-phone');
  const profileLocation = document.getElementById('profile-location');
  const profileTitle = document.getElementById('profile-title');
  const profileBio = document.getElementById('profile-bio');
  const profileSkills = document.getElementById('profile-skills');
  
  if (profileName) profileName.value = user.name || '';
  if (profileEmail) profileEmail.value = user.email || '';
  if (profilePhone) profilePhone.value = user.phone || '';
  if (profileLocation) profileLocation.value = user.address || '';
  if (profileTitle) profileTitle.value = user.title || '';
  if (profileBio) profileBio.value = user.bio || '';
  if (profileSkills) profileSkills.value = user.skills || '';
}

function handleProfileUpdate(e) {
  e.preventDefault();
  
  if (!AppState.currentUser) return;
  
  // Update user data
  AppState.currentUser.name = document.getElementById('profile-name').value;
  AppState.currentUser.email = document.getElementById('profile-email').value;
  AppState.currentUser.phone = document.getElementById('profile-phone').value;
  AppState.currentUser.address = document.getElementById('profile-location').value;
  AppState.currentUser.title = document.getElementById('profile-title').value;
  AppState.currentUser.bio = document.getElementById('profile-bio').value;
  AppState.currentUser.skills = document.getElementById('profile-skills').value;
  
  // Update user in users array
  const userIndex = AppState.users.findIndex(u => u.id === AppState.currentUser.id);
  if (userIndex !== -1) {
    AppState.users[userIndex] = { ...AppState.currentUser };
  }
  
  updateUserInterface();
  showNotification('Profile updated successfully!', 'success');
}

function loadUserApplications() {
  const applicationsList = document.getElementById('applications-list');
  if (!applicationsList || !AppState.currentUser) return;
  
  const userApplications = AppState.applications.filter(app => app.userId === AppState.currentUser.id);
  
  applicationsList.innerHTML = '';
  
  if (userApplications.length === 0) {
    applicationsList.innerHTML = '<div class="no-applications">No applications yet. <a href="#" onclick="showPage(\'jobs\')">Browse jobs</a> to get started!</div>';
    return;
  }
  
  userApplications.forEach(application => {
    const job = AppState.jobs.find(j => j.id === application.jobId);
    if (job) {
      const applicationCard = document.createElement('div');
      applicationCard.className = 'application-card job-card';
      applicationCard.innerHTML = `
        <h3>${job.title}</h3>
        <div class="job-meta">
          <span class="company">${job.company}</span>
          <span class="location">${job.location}</span>
          <span class="job-type">${job.type}</span>
          <span class="badge badge-${application.status === 'pending' ? 'warning' : application.status === 'accepted' ? 'success' : 'error'}">${application.status}</span>
        </div>
        <p class="application-date">Applied on ${formatDate(application.appliedDate)}</p>
      `;
      applicationsList.appendChild(applicationCard);
    }
  });
}

function loadUserSavedJobs() {
  const savedJobsList = document.getElementById('saved-jobs-list');
  if (!savedJobsList || !AppState.currentUser) return;
  
  const userSavedJobs = AppState.savedJobs.filter(sj => sj.userId === AppState.currentUser.id);
  
  savedJobsList.innerHTML = '';
  
  if (userSavedJobs.length === 0) {
    savedJobsList.innerHTML = '<div class="no-saved-jobs">No saved jobs yet. <a href="#" onclick="showPage(\'jobs\')">Browse jobs</a> to save some!</div>';
    return;
  }
  
  userSavedJobs.forEach(savedJob => {
    const job = AppState.jobs.find(j => j.id === savedJob.jobId);
    if (job) {
      const jobCard = createJobCard(job, true);
      jobCard.querySelector('.job-actions').innerHTML += `
        <button class="btn btn-outline btn-sm" onclick="unsaveJob(${savedJob.jobId})">Remove</button>
      `;
      savedJobsList.appendChild(jobCard);
    }
  });
}

function unsaveJob(jobId) {
  const savedJobIndex = AppState.savedJobs.findIndex(sj => 
    sj.jobId === jobId && sj.userId === AppState.currentUser.id
  );
  
  if (savedJobIndex !== -1) {
    AppState.savedJobs.splice(savedJobIndex, 1);
    loadUserSavedJobs();
    showNotification('Job removed from saved list', 'success');
  }
}

function handleJobPost(e) {
  e.preventDefault();
  
  if (!AppState.currentUser || AppState.currentUser.type !== 'employer') return;
  
  // Create new job
  const newJob = {
    id: AppState.jobs.length + 1,
    title: document.getElementById('job-title').value,
    company: document.getElementById('job-company').value,
    location: document.getElementById('job-location').value,
    category: document.getElementById('job-category').value,
    type: document.getElementById('job-type').value,
    experience: document.getElementById('job-experience').value,
    salary: document.getElementById('job-salary').value,
    description: document.getElementById('job-description').value,
    requirements: document.getElementById('job-requirements').value,
    status: 'active',
    posted: new Date().toISOString().split('T')[0],
    featured: false,
    employerId: AppState.currentUser.id
  };
  
  AppState.jobs.push(newJob);
  
  // Reset form
  document.getElementById('job-form').reset();
  
  showNotification('Job posted successfully!', 'success');
  showDashboardSection('manage-jobs');
}

function loadEmployerJobs() {
  const manageJobsList = document.getElementById('manage-jobs-list');
  if (!manageJobsList || !AppState.currentUser) return;
  
  const employerJobs = AppState.jobs.filter(job => job.employerId === AppState.currentUser.id);
  
  manageJobsList.innerHTML = '';
  
  if (employerJobs.length === 0) {
    manageJobsList.innerHTML = '<div class="no-jobs">No jobs posted yet. <a href="#" onclick="showDashboardSection(\'post-job\')">Post your first job</a>!</div>';
    return;
  }
  
  employerJobs.forEach(job => {
    const jobCard = document.createElement('div');
    jobCard.className = 'manage-job-card job-card';
    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <div class="job-meta">
        <span class="company">${job.company}</span>
        <span class="location">${job.location}</span>
        <span class="job-type">${job.type}</span>
        <span class="badge badge-${job.status === 'active' ? 'success' : 'warning'}">${job.status}</span>
      </div>
      <p class="job-posted">Posted on ${formatDate(job.posted)}</p>
      <div class="job-actions">
        <button class="btn btn-outline btn-sm" onclick="editJob(${job.id})">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="toggleJobStatus(${job.id})">
          ${job.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        <button class="btn btn-outline btn-sm" onclick="deleteJob(${job.id})">Delete</button>
      </div>
    `;
    manageJobsList.appendChild(jobCard);
  });
}

function editJob(jobId) {
  // In a real application, this would open an edit modal
  showNotification('Edit functionality would be implemented here', 'info');
}

function toggleJobStatus(jobId) {
  const job = AppState.jobs.find(j => j.id === jobId);
  if (job) {
    job.status = job.status === 'active' ? 'inactive' : 'active';
    loadEmployerJobs();
    showNotification(`Job ${job.status === 'active' ? 'activated' : 'deactivated'}`, 'success');
  }
}

function deleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    const jobIndex = AppState.jobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      AppState.jobs.splice(jobIndex, 1);
      loadEmployerJobs();
      showNotification('Job deleted successfully', 'success');
    }
  }
}

// Admin Management
function loadAdminData() {
  if (!AppState.currentUser || AppState.currentUser.type !== 'admin') return;
  
  showAdminTab('users');
  updateAdminStats();
}

function showAdminTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(`${tabName}-tab`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
  
  // Load tab-specific data
  switch(tabName) {
    case 'users':
      loadUsersTable();
      break;
    case 'jobs':
      loadJobsTable();
      break;
    case 'companies':
      loadCompaniesTable();
      break;
  }
}

function updateAdminStats() {
  // Update user stats
  const totalUsersAdmin = document.getElementById('total-users-admin');
  const newUsersToday = document.getElementById('new-users-today');
  const activeUsers = document.getElementById('active-users');
  
  if (totalUsersAdmin) totalUsersAdmin.textContent = AppState.users.length;
  if (newUsersToday) newUsersToday.textContent = AppState.users.filter(u => u.joined === new Date().toISOString().split('T')[0]).length;
  if (activeUsers) activeUsers.textContent = AppState.users.filter(u => u.status === 'active').length;
  
  // Update job stats
  const totalJobsAdmin = document.getElementById('total-jobs-admin');
  const activeJobsAdmin = document.getElementById('active-jobs-admin');
  const pendingJobs = document.getElementById('pending-jobs');
  
  if (totalJobsAdmin) totalJobsAdmin.textContent = AppState.jobs.length;
  if (activeJobsAdmin) activeJobsAdmin.textContent = AppState.jobs.filter(j => j.status === 'active').length;
  if (pendingJobs) pendingJobs.textContent = AppState.jobs.filter(j => j.status === 'pending').length;
}

function loadUsersTable() {
  const usersTableBody = document.getElementById('users-table-body');
  if (!usersTableBody) return;
  
  usersTableBody.innerHTML = '';
  
  AppState.users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge badge-primary">${user.type}</span></td>
      <td>${formatDate(user.joined)}</td>
      <td><span class="badge badge-${user.status === 'active' ? 'success' : 'error'}">${user.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewUser(${user.id})">View</button>
        <button class="btn btn-outline btn-sm" onclick="editUser(${user.id})">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    usersTableBody.appendChild(row);
  });
}

function loadJobsTable() {
  const jobsTableBody = document.getElementById('admin-jobs-table-body');
  if (!jobsTableBody) return;
  
  jobsTableBody.innerHTML = '';
  
  AppState.jobs.forEach(job => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${job.title}</td>
      <td>${job.company}</td>
      <td><span class="badge badge-primary">${job.category}</span></td>
      <td>${formatDate(job.posted)}</td>
      <td><span class="badge badge-${job.status === 'active' ? 'success' : 'warning'}">${job.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewJob(${job.id})">View</button>
        <button class="btn btn-outline btn-sm" onclick="editJob(${job.id})">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="deleteJob(${job.id})">Delete</button>
      </td>
    `;
    jobsTableBody.appendChild(row);
  });
}

function loadCompaniesTable() {
  const companiesTableBody = document.getElementById('admin-companies-table-body');
  if (!companiesTableBody) return;
  
  companiesTableBody.innerHTML = '';
  
  AppState.companies.forEach(company => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${company.name}</td>
      <td>${company.industry}</td>
      <td>${company.jobCount}</td>
      <td><span class="badge badge-${company.status === 'active' ? 'success' : 'error'}">${company.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewCompany(${company.id})">View</button>
        <button class="btn btn-outline btn-sm" onclick="editCompany(${company.id})">Edit</button>
        <button class="btn btn-outline btn-sm" onclick="deleteCompany(${company.id})">Delete</button>
      </td>
    `;
    companiesTableBody.appendChild(row);
  });
}

// Admin User Management
function openAddUserModal() {
  const modal = document.getElementById('add-user-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeAddUserModal() {
  const modal = document.getElementById('add-user-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function handleAddUser(e) {
  e.preventDefault();
  
  const name = document.getElementById('add-user-name').value;
  const email = document.getElementById('add-user-email').value;
  const password = document.getElementById('add-user-password').value;
  const type = document.getElementById('add-user-type').value;
  
  // Check if email already exists
  if (AppState.users.find(u => u.email === email)) {
    showNotification('Email already exists', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: AppState.users.length + 1,
    name: name,
    email: email,
    password: password,
    type: type,
    status: 'active',
    joined: new Date().toISOString().split('T')[0],
    phone: '',
    address: '',
    info: ''
  };
  
  AppState.users.push(newUser);
  
  // Reset form and close modal
  document.getElementById('add-user-form').reset();
  closeAddUserModal();
  
  // Refresh table and stats
  loadUsersTable();
  updateAdminStats();
  
  showNotification('User added successfully!', 'success');
}

function viewUser(userId) {
  const user = AppState.users.find(u => u.id === userId);
  if (!user) return;
  
  // Populate user details modal
  document.getElementById('details-user-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('details-user-name-label').textContent = user.name;
  document.getElementById('details-user-email-label').textContent = user.email;
  document.getElementById('details-user-type-label').textContent = user.type.charAt(0).toUpperCase() + user.type.slice(1);
  document.getElementById('details-user-joined-label').textContent = formatDate(user.joined);
  document.getElementById('details-user-phone-label').textContent = user.phone || 'Not provided';
  document.getElementById('details-user-address-label').textContent = user.address || 'Not provided';
  document.getElementById('details-user-info-label').textContent = user.info || 'No additional information';
  
  // Update status badge
  const statusBadge = document.getElementById('details-user-status-badge');
  statusBadge.textContent = user.status;
  statusBadge.className = `badge badge-${user.status === 'active' ? 'success' : 'error'}`;
  
  // Show modal
  const modal = document.getElementById('user-details-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeUserDetailsModal() {
  const modal = document.getElementById('user-details-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function editUser(userId) {
  const user = AppState.users.find(u => u.id === userId);
  if (!user) return;
  
  // Populate edit form
  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-name').value = user.name;
  document.getElementById('edit-user-email').value = user.email;
  document.getElementById('edit-user-type').value = user.type;
  document.getElementById('edit-user-status').value = user.status;
  
  // Show edit modal
  const modal = document.getElementById('edit-user-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeEditUserModal() {
  const modal = document.getElementById('edit-user-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function handleEditUser(e) {
  e.preventDefault();
  
  const userId = parseInt(document.getElementById('edit-user-id').value);
  const userIndex = AppState.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return;
  
  // Update user
  AppState.users[userIndex] = {
    ...AppState.users[userIndex],
    name: document.getElementById('edit-user-name').value,
    email: document.getElementById('edit-user-email').value,
    type: document.getElementById('edit-user-type').value,
    status: document.getElementById('edit-user-status').value
  };
  
  closeEditUserModal();
  loadUsersTable();
  updateAdminStats();
  
  showNotification('User updated successfully!', 'success');
}

function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    const userIndex = AppState.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      AppState.users.splice(userIndex, 1);
      loadUsersTable();
      updateAdminStats();
      showNotification('User deleted successfully', 'success');
    }
  }
}

// Admin Export Functions
function exportUsersCSV() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Name,Email,Type,Status,Joined\n" + 
    AppState.users.map(user => 
      `"${user.name}","${user.email}","${user.type}","${user.status}","${user.joined}"`
    ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "users.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Users exported successfully!', 'success');
}

function exportJobsCSV() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Title,Company,Location,Category,Type,Status,Posted\n" + 
    AppState.jobs.map(job => 
      `"${job.title}","${job.company}","${job.location}","${job.category}","${job.type}","${job.status}","${job.posted}"`
    ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "jobs.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Jobs exported successfully!', 'success');
}

function exportCompaniesCSV() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Name,Industry,Jobs Posted,Status\n" + 
    AppState.companies.map(company => 
      `"${company.name}","${company.industry}","${company.jobCount}","${company.status}"`
    ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "companies.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Companies exported successfully!', 'success');
}

function viewJob(jobId) {
  showJobModal(jobId);
}

function viewCompany(companyId) {
  const company = AppState.companies.find(c => c.id === companyId);
  if (!company) {
    showNotification('Company not found', 'error');
    return;
  }
  document.getElementById('details-company-name').textContent = company.name;
  document.getElementById('details-company-name-label').textContent = company.name;
  document.getElementById('details-company-industry-label').textContent = company.industry;
  document.getElementById('details-company-description-label').textContent = company.description;
  document.getElementById('details-company-jobcount-label').textContent = company.jobCount;
  document.getElementById('details-company-status-label').textContent = company.status.charAt(0).toUpperCase() + company.status.slice(1);
  const modal = document.getElementById('company-details-modal');
  if (modal) modal.classList.add('show');
}

function closeCompanyDetailsModal() {
  const modal = document.getElementById('company-details-modal');
  if (modal) modal.classList.remove('show');
}

function editCompany(companyId) {
  showNotification('Company edit functionality would be implemented here', 'info');
}

function deleteCompany(companyId) {
  if (confirm('Are you sure you want to delete this company?')) {
    const companyIndex = AppState.companies.findIndex(c => c.id === companyId);
    if (companyIndex !== -1) {
      AppState.companies.splice(companyIndex, 1);
      loadCompaniesTable();
      showNotification('Company deleted successfully', 'success');
    }
  }
}

// Utility Functions
function updateStats() {
  // Update homepage stats
  const totalJobs = document.getElementById('total-jobs');
  const totalCompanies = document.getElementById('total-companies');
  const totalUsers = document.getElementById('total-users');
  
  if (totalJobs) totalJobs.textContent = AppState.jobs.filter(j => j.status === 'active').length.toLocaleString();
  if (totalCompanies) totalCompanies.textContent = AppState.companies.length.toLocaleString();
  if (totalUsers) totalUsers.textContent = AppState.users.filter(u => u.type === 'jobseeker').length.toLocaleString();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary'});
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
    font-weight: 500;
  `;
  notification.textContent = message;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  
  if (!document.head.querySelector('style[data-notifications]')) {
    style.setAttribute('data-notifications', 'true');
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 4000);
}

function loadDashboardData() {
  // Initialize dashboard data based on user type
  if (!AppState.currentUser) return;
  
  // Load common dashboard data
  updateDashboardStats();
  loadRecentActivity();
  
  // Load type-specific data
  if (AppState.currentUser.type === 'employer') {
    // Load employer-specific data
    loadEmployerJobs();
  } else if (AppState.currentUser.type === 'admin') {
    // Load admin-specific data
    loadAdminData();
  }
}