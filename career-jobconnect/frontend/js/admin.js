// admin.js - Dashboard navigation and ticket management for Admin

// Initialize ticket data in localStorage if it doesn't exist
function initializeTickets() {
    if (!localStorage.getItem('supportTickets')) {
        const sampleTickets = [
            {
                id: 'TKT-' + Date.now(),
                title: 'Login issues',
                description: 'Users are unable to login with correct credentials',
                status: 'Open',
                priority: 'High',
                category: 'Authentication',
                createdBy: 'user@example.com',
                assignedTo: 'admin@example.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                comments: []
            },
            {
                id: 'TKT-' + (Date.now() + 1),
                title: 'Profile update error',
                description: 'Profile picture upload fails with 500 error',
                status: 'In Progress',
                priority: 'Medium',
                category: 'Profile',
                createdBy: 'another@example.com',
                assignedTo: 'admin@example.com',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date().toISOString(),
                comments: [
                    {
                        text: 'Looking into this issue',
                        author: 'admin@example.com',
                        timestamp: new Date().toISOString()
                    }
                ]
            }
        ];
        localStorage.setItem('supportTickets', JSON.stringify(sampleTickets));
    }
}

// Render tickets in the admin dashboard
function renderTickets(filter = {}) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const filteredTickets = tickets.filter(ticket => {
        return Object.entries(filter).every(([key, value]) => {
            if (!value) return true;
            return String(ticket[key]).toLowerCase().includes(value.toLowerCase());
        });
    });

    const tbody = document.querySelector('#ticketsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = filteredTickets.map(ticket => `
        <tr data-ticket-id="${ticket.id}">
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td><span class="status-badge ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span></td>
            <td>${ticket.priority}</td>
            <td>${ticket.category}</td>
            <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="view-ticket-btn" data-id="${ticket.id}">View</button>
                <button class="update-status-btn" data-id="${ticket.id}">Update</button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to the buttons
    document.querySelectorAll('.view-ticket-btn').forEach(btn => {
        btn.addEventListener('click', () => showTicketDetails(btn.dataset.id));
    });

    document.querySelectorAll('.update-status-btn').forEach(btn => {
        btn.addEventListener('click', () => showStatusUpdateModal(btn.dataset.id));
    });
}

// Show ticket details in a modal
function showTicketDetails(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const modal = document.createElement('div');
    modal.className = 'ticket-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${ticket.title} <span class="status-badge ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span></h2>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p><strong>Category:</strong> ${ticket.category}</p>
            <p><strong>Created by:</strong> ${ticket.createdBy}</p>
            <p><strong>Assigned to:</strong> ${ticket.assignedTo}</p>
            <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
            
            <h3>Description</h3>
            <div class="ticket-description">${ticket.description}</div>
            
            <h3>Comments</h3>
            <div class="ticket-comments">
                ${ticket.comments && ticket.comments.length > 0 
                    ? ticket.comments.map(c => `
                        <div class="comment">
                            <div class="comment-header">
                                <strong>${c.author}</strong>
                                <span>${new Date(c.timestamp).toLocaleString()}</span>
                            </div>
                            <p>${c.text}</p>
                        </div>
                    `).join('')
                    : '<p>No comments yet.</p>'
                }
            </div>
            
            <div class="add-comment">
                <h4>Add Comment</h4>
                <textarea id="commentText" rows="3" style="width: 100%; margin-bottom: 10px;"></textarea>
                <button id="submitComment" class="primary-btn">Submit Comment</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Submit comment
    const submitBtn = modal.querySelector('#submitComment');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const commentText = modal.querySelector('#commentText').value.trim();
            if (commentText) {
                const comment = {
                    text: commentText,
                    author: 'admin@example.com', // In a real app, this would be the logged-in admin
                    timestamp: new Date().toISOString()
                };
                
                // Update ticket in localStorage
                const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
                const ticketIndex = tickets.findIndex(t => t.id === ticketId);
                if (ticketIndex !== -1) {
                    if (!tickets[ticketIndex].comments) {
                        tickets[ticketIndex].comments = [];
                    }
                    tickets[ticketIndex].comments.push(comment);
                    tickets[ticketIndex].updatedAt = new Date().toISOString();
                    localStorage.setItem('supportTickets', JSON.stringify(tickets));
                    
                    // Refresh the view
                    document.body.removeChild(modal);
                    showTicketDetails(ticketId);
                }
            }
        });
    }
}

// Show status update modal
function showStatusUpdateModal(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const modal = document.createElement('div');
    modal.className = 'ticket-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <span class="close-modal">&times;</span>
            <h2>Update Ticket Status</h2>
            
            <div class="form-group">
                <label for="statusSelect">Status:</label>
                <select id="statusSelect" class="form-control">
                    <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                    <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="assignedTo">Assign To:</label>
                <input type="text" id="assignedTo" class="form-control" value="${ticket.assignedTo || ''}">
            </div>
            
            <div class="form-group">
                <label for="adminNotes">Notes (optional):</label>
                <textarea id="adminNotes" class="form-control" rows="3"></textarea>
            </div>
            
            <div class="modal-actions">
                <button id="cancelUpdate" class="secondary-btn">Cancel</button>
                <button id="saveStatus" class="primary-btn">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Close modal
    const closeModal = () => document.body.removeChild(modal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('#cancelUpdate').addEventListener('click', closeModal);
    
    // Save changes
    modal.querySelector('#saveStatus').addEventListener('click', () => {
        const newStatus = modal.querySelector('#statusSelect').value;
        const assignedTo = modal.querySelector('#assignedTo').value.trim();
        const notes = modal.querySelector('#adminNotes').value.trim();
        
        // Update ticket in localStorage
        const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].status = newStatus;
            tickets[ticketIndex].assignedTo = assignedTo;
            tickets[ticketIndex].updatedAt = new Date().toISOString();
            
            // Add note as a comment if provided
            if (notes) {
                if (!tickets[ticketIndex].comments) {
                    tickets[ticketIndex].comments = [];
                }
                tickets[ticketIndex].comments.push({
                    text: `Status changed to ${newStatus}. ${notes}`,
                    author: 'admin@example.com', // In a real app, this would be the logged-in admin
                    timestamp: new Date().toISOString()
                });
            }
            
            localStorage.setItem('supportTickets', JSON.stringify(tickets));
            closeModal();
            renderTickets(); // Refresh the tickets list
        }
    });
}

// Sample users data
const usersData = [
    {id: 1, name: 'Alice Johnson', email: 'alice@email.com', role: 'Admin', status: 'Active'},
    {id: 2, name: 'Bob Smith', email: 'bob@email.com', role: 'Employer', status: 'Active'},
    {id: 3, name: 'Carol Lee', email: 'carol@email.com', role: 'Job Seeker', status: 'Suspended'},
    {id: 4, name: 'David Kim', email: 'david@email.com', role: 'Employer', status: 'Active'},
    {id: 5, name: 'Eva Green', email: 'eva@email.com', role: 'Job Seeker', status: 'Active'}
];

function renderUsers() {
    const container = document.getElementById('usersTableContainer');
    if (!container) return;
    let filtered = usersData.filter(u => {
        const name = document.getElementById('filterUserName')?.value.toLowerCase() || '';
        const email = document.getElementById('filterUserEmail')?.value.toLowerCase() || '';
        const role = document.getElementById('filterUserRole')?.value || '';
        const status = document.getElementById('filterUserStatus')?.value || '';
        if (name && !u.name.toLowerCase().includes(name)) return false;
        if (email && !u.email.toLowerCase().includes(email)) return false;
        if (role && u.role !== role) return false;
        if (status && u.status !== status) return false;
        return true;
    });
    container.innerHTML = `<table class="data-table" style="width:100%;min-width:600px;">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${filtered.map(u => `
                <tr>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>
                        <select class="user-role-select" data-id="${u.id}" style="padding:0.2rem 0.6rem;border-radius:4px;">
                            <option value="Admin"${u.role==='Admin'?' selected':''}>Admin</option>
                            <option value="Employer"${u.role==='Employer'?' selected':''}>Employer</option>
                            <option value="Job Seeker"${u.role==='Job Seeker'?' selected':''}>Job Seeker</option>
                        </select>
                    </td>
                    <td><span class="status-badge ${u.status.toLowerCase()}" style="background:${u.status==='Active'?'#e8f5e9':'#ffebee'};color:${u.status==='Active'?'#2e7d32':'#d32f2f'};">${u.status}</span></td>
                    <td>
                        <button class="action-btn edit-user-btn" data-id="${u.id}" style="background:#e3f2fd;color:#1976d2;">Edit</button>
                        <button class="action-btn suspend-user-btn" data-id="${u.id}" style="background:#fff8e1;color:#ff8f00;">${u.status==='Suspended'?'Activate':'Suspend'}</button>
                        <button class="action-btn delete-user-btn" data-id="${u.id}" style="background:#ffebee;color:#d32f2f;">Delete</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
    // Add event listeners for actions
    container.querySelectorAll('.user-role-select').forEach(sel => {
        sel.addEventListener('change', e => {
            const id = +e.target.dataset.id;
            const user = usersData.find(u => u.id === id);
            if (user) { user.role = e.target.value; renderUsers(); }
        });
    });
    container.querySelectorAll('.suspend-user-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = +btn.dataset.id;
            const user = usersData.find(u => u.id === id);
            if (user) { user.status = user.status==='Active'?'Suspended':'Active'; renderUsers(); }
        });
    });
    container.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = +btn.dataset.id;
            const idx = usersData.findIndex(u => u.id === id);
            if (idx !== -1) { usersData.splice(idx,1); renderUsers(); }
        });
    });
    // Optionally, add edit-user-btn logic here
}

// Initialize Manage Users filters
['filterUserName','filterUserEmail','filterUserRole','filterUserStatus'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', renderUsers);
        el.addEventListener('change', renderUsers);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    renderUsers();
});

// Show job details in modal
function showJobDetails(jobId) {
    const job = jobsData.find(j => j.id === parseInt(jobId));
    if (!job) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 8px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #333; margin: 0 0 0.5rem 0;">${job.title}</h3>
                    <div style="display: flex; gap: 1rem; font-size: 1rem; color: #666; margin-bottom: 0.5rem;">
                        <span>${job.company}</span>
                        <span>•</span>
                        <span>${job.location}</span>
                        <span>•</span>
                        <span>${job.type}</span>
                    </div>
                    <div style="display: flex; gap: 1rem; font-size: 0.9rem; color: #888;">
                        <span>Posted: ${job.posted}</span>
                        <span>•</span>
                        <span>${job.applicants} ${job.applicants === 1 ? 'applicant' : 'applicants'}</span>
                    </div>
                </div>
                <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">
                    &times;
                </button>
            </div>
            
            <div style="padding: 1.5rem;">
                <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; color: #444;">Job Details</h4>
                        <div style="display: grid; grid-template-columns: 120px 1fr; gap: 0.75rem; font-size: 0.95rem;">
                            <div style="color: #777;">Status:</div>
                            <div>
                                <span style="
                                    background: ${job.status === 'pending' ? '#fff8e1' : job.status === 'approved' ? '#e8f5e9' : '#ffebee'};
                                    color: ${job.status === 'pending' ? '#ff8f00' : job.status === 'approved' ? '#2e7d32' : '#d32f2f'};
                                    padding: 0.3rem 0.8rem;
                                    border-radius: 12px;
                                    font-size: 0.85rem;
                                    font-weight: 500;
                                    text-transform: capitalize;
                                    display: inline-block;
                                ">
                                    ${job.status}
                                </span>
                            </div>
                            
                            <div style="color: #777;">Posted:</div>
                            <div>${job.posted}</div>
                            
                            <div style="color: #777;">Salary:</div>
                            <div>${job.salary || 'Not specified'}</div>
                            
                            <div style="color: #777;">Posted by:</div>
                            <div>${job.postedBy || 'Unknown'}</div>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; color: #444;">Actions</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <button class="action-btn job-status-btn" data-action="approve" data-id="${job.id}" style="
                                background: #e8f5e9;
                                color: #2e7d32;
                                border: none;
                                padding: 0.6rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                                text-align: left;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.95rem;
                                ${job.status === 'approved' ? 'opacity: 0.7; cursor: not-allowed;' : ''}
                            " ${job.status === 'approved' ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Approve Job
                            </button>
                            <button class="action-btn job-status-btn" data-action="reject" data-id="${job.id}" style="
                                background: #ffebee;
                                color: #d32f2f;
                                border: none;
                                padding: 0.6rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                                text-align: left;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.95rem;
                                ${job.status === 'rejected' ? 'opacity: 0.7; cursor: not-allowed;' : ''}
                            " ${job.status === 'rejected' ? 'disabled' : ''}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Reject Job
                            </button>
                            <button class="action-btn" style="
                                background: #e3f2fd;
                                color: #1976d2;
                                border: none;
                                padding: 0.6rem 1rem;
                                border-radius: 6px;
                                cursor: pointer;
                                text-align: left;
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                font-size: 0.95rem;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4V11H11V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M20 4H13V11H20V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M11 13H4V20H11V13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M20 13H13V20H20V13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                View Full Details
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; color: #444;">Job Description</h4>
                    <div style="background: #f9f9f9; padding: 1rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.6;">
                        ${job.description}
                    </div>
                </div>
                
                <div>
                    <h4 style="font-size: 1rem; font-weight: 600; margin: 0 0 1rem 0; color: #444;">Requirements</h4>
                    <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.8;">
                        ${job.requirements ? job.requirements.map(req => `<li>${req}</li>`).join('') : 
                            '<li>No specific requirements listed.</li>'}
                    </ul>
                </div>
            </div>
            
            <div style="padding: 1rem 1.5rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button class="close-btn" style="
                    background: #f5f5f5;
                    color: #666;
                    border: 1px solid #ddd;
                    padding: 0.5rem 1.25rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">
                    Close
                </button>
                <button class="save-btn" style="
                    background: #0077cc;
                    color: white;
                    border: none;
                    padding: 0.5rem 1.25rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                ">
                    Save Changes
                </button>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close modal handlers
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };

    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-btn').addEventListener('click', closeModal);

    // Status update handler
    modal.querySelectorAll('.job-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            updateJobStatus(jobId, action);
            closeModal();
            renderJobs();
        });
    });

    // Close when clicking outside modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Apply job filters
function applyJobFilters() {
    const statusFilter = document.getElementById('jobStatusFilter')?.value.toLowerCase() || '';
    const dateFilter = document.getElementById('jobDateFilter')?.value || '';
    const searchTerm = document.getElementById('jobSearchInput')?.value.toLowerCase() || '';
    
    const filteredJobs = jobsData.filter(job => {
        // Filter by status
        if (statusFilter && job.status !== statusFilter) return false;
        
        // Filter by date (simplified for demo)
        if (dateFilter === 'today' && job.posted !== 'Today') return false;
        if (dateFilter === 'week' && job.posted.includes('week')) return true;
        if (dateFilter === 'month' && job.posted.includes('month')) return true;
        
        // Filter by search term
        if (searchTerm) {
            const searchText = `${job.title} ${job.company} ${job.location} ${job.type} ${job.description}`.toLowerCase();
            if (!searchText.includes(searchTerm)) return false;
        }
        
        return true;
    });
    
    // Update the jobs list with filtered results
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;
    
    // Store original jobs data and render filtered results
    const originalJobs = [...jobsData];
    jobsData.length = 0;
    jobsData.push(...filteredJobs);
    renderJobs();
    
    // Restore original data
    jobsData.length = 0;
    jobsData.push(...originalJobs);
    
    // Update result count
    const resultCount = document.querySelector('#jobsContainer .result-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${filteredJobs.length} of ${originalJobs.length} jobs`;
    }
}

// Check system health
function checkSystemHealth() {
    const healthContainer = document.getElementById('systemHealthContainer');
    if (!healthContainer) return;
    
    // In a real app, this would check actual system status
    const healthStatus = [
        { name: 'API Server', status: 'operational', details: 'Response time: 120ms' },
        { name: 'Database', status: 'operational', details: 'Connected, 5 active connections' },
        { name: 'Email Service', status: 'degraded', details: 'High latency (800ms)' },
        { name: 'File Storage', status: 'operational', details: '2.5GB used of 10GB' },
        { name: 'Cache', status: 'operational', details: 'Hit rate: 92%' }
    ];
    
    healthContainer.innerHTML = healthStatus.map(item => `
        <div style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 500; margin-bottom: 0.25rem;">${item.name}</div>
                <div style="font-size: 0.85rem; color: #666;">${item.details}</div>
            </div>
            <span style="
                background: ${item.status === 'operational' ? '#e8f5e9' : item.status === 'degraded' ? '#fff8e1' : '#ffebee'};
                color: ${item.status === 'operational' ? '#2e7d32' : item.status === 'degraded' ? '#ff8f00' : '#d32f2f'};
                padding: 0.3rem 0.8rem;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
                text-transform: capitalize;
            ">
                ${item.status}
            </span>
        </div>
    `).join('');
}

// Update job status
function updateJobStatus(jobId, status) {
    const job = jobsData.find(j => j.id === parseInt(jobId));
    if (job) {
        job.status = status === 'approve' ? 'approved' : 'rejected';
        // In a real app, you would make an API call to update the job status
        console.log(`Job ${jobId} status updated to: ${job.status}`);
    }
}

// Job Moderation Data
const jobsData = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        type: "Full-time",
        status: "pending",
        posted: "2 days ago",
        applicants: 12,
        description: "We are looking for an experienced Frontend Developer to join our team.",
        salary: "$120,000 - $150,000",
        postedBy: "john.doe@techcorp.com"
    },
    {
        id: 2,
        title: "UX/UI Designer",
        company: "DesignHub",
        location: "Remote",
        type: "Contract",
        status: "approved",
        posted: "1 day ago",
        applicants: 8,
        description: "Looking for a talented UX/UI Designer to create amazing user experiences.",
        salary: "$50 - $80 per hour",
        postedBy: "jane.smith@designhub.com"
    }
];

// Render jobs list
function renderJobs() {
    const jobsList = document.getElementById('jobsList');
    if (!jobsList) return;

    jobsList.innerHTML = jobsData.map(job => `
        <div class="job-item" style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600; color: #0077cc; margin-bottom: 0.25rem;">${job.title}</div>
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">${job.company} • ${job.location} • ${job.type}</div>
                <div style="display: flex; gap: 1rem; font-size: 0.85rem;">
                    <span>Posted: ${job.posted}</span>
                    <span>•</span>
                    <span>${job.applicants} ${job.applicants === 1 ? 'applicant' : 'applicants'}</span>
                </div>
            </div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <span style="
                    background: ${job.status === 'pending' ? '#fff8e1' : job.status === 'approved' ? '#e8f5e9' : '#ffebee'};
                    color: ${job.status === 'pending' ? '#ff8f00' : job.status === 'approved' ? '#2e7d32' : '#d32f2f'};
                    padding: 0.3rem 0.8rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    text-transform: capitalize;
                ">
                    ${job.status}
                </span>
                <button class="view-job-btn" data-id="${job.id}" style="
                    background: #e3f2fd;
                    color: #1976d2;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                ">
                    ${job.status === 'pending' ? 'Review' : 'View'}
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to view buttons
    document.querySelectorAll('.view-job-btn').forEach(btn => {
        btn.addEventListener('click', () => showJobDetails(btn.dataset.id));
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.dashboard-main section');
    
    // Get all dashboard elements
    const dashboardSections = {
        'dashboard-overview': () => {
            updateAnalytics();
        },
        'moderate-jobs': () => {
            // Initialize job elements
            const refreshJobsBtn = document.getElementById('refreshJobsBtn');
            const resetFiltersBtn = document.getElementById('resetFiltersBtn');
            const jobStatusFilter = document.getElementById('jobStatusFilter');
            const jobDateFilter = document.getElementById('jobDateFilter');
            const jobSearchInput = document.getElementById('jobSearchInput');
            
            // Initialize jobs list
            renderJobs();
            
            // Add filter event listeners
            const filterInputs = [jobStatusFilter, jobDateFilter, jobSearchInput];
            filterInputs.forEach(element => {
                if (element) {
                    element.addEventListener('change', applyJobFilters);
                    element.addEventListener('input', applyJobFilters);
                }
            });
            
            // Add refresh button handler
            if (refreshJobsBtn) {
                refreshJobsBtn.addEventListener('click', () => {
                    renderJobs();
                    showNotification('Jobs list refreshed', 'success');
                });
            }
            
            // Add reset filters handler
            if (resetFiltersBtn) {
                resetFiltersBtn.addEventListener('click', () => {
                    if (jobStatusFilter) jobStatusFilter.value = '';
                    if (jobDateFilter) jobDateFilter.value = '';
                    if (jobSearchInput) jobSearchInput.value = '';
                    renderJobs();
                });
            }
        },
        'tickets-management': () => {
            initializeTickets();
            renderTickets();
            
            // Add event listeners for ticket filtering
            const statusFilter = document.getElementById('statusFilter');
            const priorityFilter = document.getElementById('priorityFilter');
            const searchInput = document.getElementById('searchInput');
            
            const filterInputs = [statusFilter, priorityFilter, searchInput];
            filterInputs.forEach(element => {
                if (element) {
                    element.addEventListener('change', applyTicketFilters);
                    element.addEventListener('input', applyTicketFilters);
                }
            });
        },
        'reports-analytics': () => {
            // Show analytics chart or placeholder
            const chartContainer = document.getElementById('analyticsChart');
            if (chartContainer) {
                chartContainer.parentElement.innerHTML = `<div style='padding:2rem;text-align:center;'>
                    <h3 style='color:#0077cc;'>Analytics Coming Soon</h3>
                    <p style='color:#666;'>Detailed analytics and downloadable reports will appear here.</p>
                    <div style='margin:2rem auto;width:100px;height:100px;background:linear-gradient(135deg,#e3f2fd,#fff8e1,#e8f5e9);border-radius:50%;'></div>
                </div>`;
            }
        },
        'system-health': () => {
            // Initialize system health checks
            checkSystemHealth();
        }
    };
    
    // Dashboard sidebar dropdown logic
const dashboardDropdownBtn = document.getElementById('dashboardDropdownBtn');
const dashboardDropdownMenu = document.getElementById('dashboardDropdownMenu');
dashboardDropdownBtn?.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dashboardDropdownMenu.style.display = dashboardDropdownMenu.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.sidebar-dropdown')) {
        dashboardDropdownMenu.style.display = 'none';
    }
});
dashboardDropdownMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
        dashboardDropdownMenu.style.display = 'none';
        // Optionally, scroll to or activate the section
    });
});
// Set up sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Hide all sections first
            sections.forEach(sec => { sec.style.display = 'none'; });
            // Show the selected section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Show loading indicator
                if (targetSection.querySelector('.loading-indicator')) {
                    targetSection.querySelector('.loading-indicator').style.display = 'block';
                }
                // Render content for each section
                switch(targetId) {
                    case 'manage-users':
                        renderUsers();
                        break;
                    case 'moderate-jobs':
                        renderJobs();
                        break;
                    case 'tickets-management':
                        renderTickets();
                        break;
                    case 'reports-analytics':
                        updateAnalytics();
                        break;
                    case 'system-health':
                        checkSystemHealth();
                        break;
                }
                // Hide loading indicator after rendering
                setTimeout(() => {
                    if (targetSection.querySelector('.loading-indicator')) {
                        targetSection.querySelector('.loading-indicator').style.display = 'none';
                    }
                }, 500);
            }
        });
    });

// --- Notifications Logic ---
const notifications = [
    { id: 1, type: 'user', message: 'New user registered: John Doe', time: '2 min ago' },
    { id: 2, type: 'job', message: 'Job pending approval: UX Designer', time: '10 min ago' },
    { id: 3, type: 'system', message: 'System backup completed', time: '30 min ago' }
];
function renderNotifications() {
    const list = document.getElementById('notificationsList');
    const count = document.getElementById('notificationCount');
    if (!list || !count) return;
    list.innerHTML = notifications.length
        ? notifications.map(n => `<li style='padding:0.7rem 0;border-bottom:1px solid #eee;'><span style='font-weight:600;'>${n.type.toUpperCase()}</span>: ${n.message}<br><span style='font-size:0.85rem;color:#888;'>${n.time}</span></li>`).join('')
        : `<li style='padding:0.7rem 0;color:#888;'>No notifications</li>`;
    count.style.display = notifications.length ? 'inline-block' : 'none';
    count.textContent = notifications.length;
}
document.getElementById('notificationsBtn')?.addEventListener('click', () => {
    const dropdown = document.getElementById('notificationsDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    renderNotifications();
});
document.getElementById('clearNotificationsBtn')?.addEventListener('click', () => {
    notifications.length = 0;
    renderNotifications();
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('#notificationBell')) {
        document.getElementById('notificationsDropdown').style.display = 'none';
    }
});
// --- Admin Profile Modal Logic ---
// Profile menu open/close logic
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        profileMenu.style.display = 'none';
    }
});
// Edit Profile
const openProfileModalBtn = document.getElementById('openProfileModalBtn');
openProfileModalBtn?.addEventListener('click', () => {
    document.getElementById('adminProfileModal').style.display = 'flex';
    profileMenu.style.display = 'none';
});
document.getElementById('cancelAdminProfileBtn')?.addEventListener('click', () => {
    document.getElementById('adminProfileModal').style.display = 'none';
});
document.getElementById('adminProfileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Profile updated successfully.');
    document.getElementById('adminProfileModal').style.display = 'none';
});
// Settings (demo)
document.getElementById('settingsBtn')?.addEventListener('click', () => {
    showNotification('Settings feature coming soon!');
    profileMenu.style.display = 'none';
});
// Audit Log
const openAuditLogBtn = document.getElementById('openAuditLogBtn');
openAuditLogBtn?.addEventListener('click', () => {
    renderAuditLogs();
    document.getElementById('auditLogModal').style.display = 'flex';
    profileMenu.style.display = 'none';
});
document.getElementById('closeAuditLogBtn')?.addEventListener('click', () => {
    document.getElementById('auditLogModal').style.display = 'none';
});
// Logout (demo)
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    showNotification('Logging out...');
    setTimeout(() => window.location.href = '../pages/login.html', 1200);
    profileMenu.style.display = 'none';
});

// Add professional feedback for all action buttons (edit, suspend, delete, approve, etc.)
function addActionFeedback(btn, successMsg, errorMsg) {
    btn.disabled = true;
    btn.style.opacity = 0.6;
    setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = 1;
        showNotification(successMsg || 'Action completed successfully.');
    }, 800);
}
// Example: Attach to suspend/delete buttons in renderUsers/renderJobs, etc.
// Usage: addActionFeedback(btn, 'User suspended.', 'Could not suspend user.');
    
    // Show dashboard section by default
    const defaultSection = 'dashboard-overview';
    sections.forEach(sec => {
        if (sec.id === defaultSection) {
            sec.style.display = 'block';
            if (dashboardSections[defaultSection]) {
                dashboardSections[defaultSection]();
            }
        } else {
            sec.style.display = 'none';
        }
    });
    
    // Create ticket button
    const createTicketBtn = document.getElementById('createTicketBtn');
    if (createTicketBtn) {
        createTicketBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real app, this would open a form to create a new ticket
            alert('Create new ticket functionality would open a form here.');
        });
    }
});

// Apply filters to tickets
function applyTicketFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const priorityFilter = document.getElementById('priorityFilter')?.value || '';
    const searchTerm = document.getElementById('searchInput')?.value || '';
    
    renderTickets({
        status: statusFilter,
        priority: priorityFilter,
        title: searchTerm
    });
}
