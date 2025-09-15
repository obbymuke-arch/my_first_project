// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Admin Panel Tabs Functionality
    function initAdminTabs() {
        const tabButtons = document.querySelectorAll('.admin-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.getAttribute('data-tab');
                const content = document.getElementById(tab);
                if (content) content.classList.add('active');
            });
        });
    }
    // ...existing code...
    
    // Sample Data for Dynamic Content
    const sampleJobs = [
        { id: 1, title: 'Frontend Developer', company: 'TechCorp', status: 'pending', reported: false },
        { id: 2, title: 'Backend Engineer', company: 'DataWorks', status: 'reported', reported: true },
        { id: 3, title: 'UI/UX Designer', company: 'Designify', status: 'approved', reported: false }
    ];
    const sampleTickets = [
        { id: 1, title: 'Login issue', status: 'open', priority: 'high', created: '2 hours ago', assigned: 'John Doe' },
        { id: 2, title: 'Page not loading', status: 'in-progress', priority: 'medium', created: '1 day ago', assigned: 'Sarah Johnson' },
        { id: 3, title: 'Email notifications not working', status: 'open', priority: 'high', created: '3 hours ago', assigned: 'Mike Chen' }
    ];
    const sampleUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'Active' },
        { id: 3, name: 'Bob Brown', email: 'bob@example.com', role: 'User', status: 'Suspended' }
    ];

    // Render Job Moderation
    function renderJobModeration(jobs) {
        const queue = document.getElementById('moderation-queue');
        if (!queue) return;
        if (jobs.length === 0) {
            queue.innerHTML = '<div class="no-items">No jobs require moderation at this time.</div>';
            return;
        }
        queue.innerHTML = jobs.map(job => `
            <div class="job-item">
                <div class="job-title">${job.title} <span class="company">@${job.company}</span></div>
                <div class="job-status status-${job.status}">${job.status.charAt(0).toUpperCase() + job.status.slice(1)}</div>
                <div class="job-actions">
                    <button class="btn btn-outline btn-sm" onclick="alert('Reviewing job #${job.id}')">Review</button>
                    <button class="btn btn-primary btn-sm" onclick="alert('Approving job #${job.id}')">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="alert('Rejecting job #${job.id}')">Reject</button>
                </div>
                <div class="job-meta">Reported: <b>${job.reported ? 'Yes' : 'No'}</b></div>
            </div>
        `).join('');
    }
    // Render Tickets
    function renderTickets(tickets) {
        const ticketList = document.getElementById('ticket-list');
        if (!ticketList) return;
        if (tickets.length === 0) {
            ticketList.innerHTML = '<div class="no-tickets">No tickets found matching your filters.</div>';
            return;
        }
        ticketList.innerHTML = tickets.map(ticket => `
            <div class="ticket-item">
                <div class="ticket-header">
                    <h3 class="ticket-title">${ticket.title}</h3>
                    <span class="ticket-priority priority-${ticket.priority}">${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                </div>
                <div class="ticket-meta">
                    <span class="ticket-status"><span class="status-dot status-${ticket.status.replace('-', '')}"></span>${ticket.status.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    <span>•</span>
                    <span>Created ${ticket.created}</span>
                    <span>•</span>
                    <span>Assigned to ${ticket.assigned}</span>
                </div>
                <div class="ticket-actions">
                    <button class="btn btn-outline btn-sm" onclick="alert('Viewing ticket #${ticket.id}')">View</button>
                    <button class="btn btn-primary btn-sm" onclick="alert('Assigning ticket #${ticket.id}')">Assign</button>
                    <button class="btn btn-danger btn-sm" onclick="alert('Closing ticket #${ticket.id}')">Close</button>
                </div>
            </div>
        `).join('');
    }
    // Render Users
    function renderUsers(users) {
        const userList = document.getElementById('user-list');
        if (!userList) return;
        if (users.length === 0) {
            userList.innerHTML = '<div class="no-users">No users found.</div>';
            return;
        }
        userList.innerHTML = users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <span class="user-name">${user.name}</span>
                    <span class="user-email">${user.email}</span>
                    <span class="user-role">${user.role}</span>
                    <span class="user-status status-${user.status.toLowerCase()}">${user.status}</span>
                </div>
                <div class="user-actions">
                    <button class="btn btn-outline btn-sm" onclick="alert('Editing user: ${user.name}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="alert('Suspending user: ${user.name}')">Suspend</button>
                    <button class="btn btn-primary btn-sm" onclick="alert('Resetting password for: ${user.name}')">Reset Password</button>
                </div>
            </div>
        `).join('');
}
// Add sample content to system logs and audit logs
function renderSampleSystemLogs() {
    const logContainer = document.getElementById('system-logs');
    if (!logContainer) return;
    logContainer.innerHTML = [
        '<div class="log-entry"><span class="log-time">10:32:45</span><span class="log-level info">INFO</span><span class="log-message">System check completed successfully</span></div>',
        '<div class="log-entry"><span class="log-time">10:30:12</span><span class="log-level warning">WARN</span><span class="log-message">High CPU usage detected on server-01</span></div>',
        '<div class="log-entry"><span class="log-time">10:28:01</span><span class="log-level error">ERROR</span><span class="log-message">Database connection lost</span></div>'
    ].join('');
}
function renderSampleAuditLogs() {
    const auditContainer = document.getElementById('audit-entries');
    if (!auditContainer) return;
    auditContainer.innerHTML = [
        '<div class="audit-entry"><div class="audit-time">Today, 09:45</div><div class="audit-icon"><i class="fas fa-user-edit"></i></div><div class="audit-details"><div class="audit-action">User profile updated</div><div class="audit-user">John Doe (admin)</div></div></div>',
        '<div class="audit-entry"><div class="audit-time">Today, 08:30</div><div class="audit-icon"><i class="fas fa-lock"></i></div><div class="audit-details"><div class="audit-action">Password changed</div><div class="audit-user">Jane Smith (user)</div></div></div>',
        '<div class="audit-entry"><div class="audit-time">Yesterday, 17:20</div><div class="audit-icon"><i class="fas fa-database"></i></div><div class="audit-details"><div class="audit-action">Database backup completed</div><div class="audit-user">System</div></div></div>'
    ].join('');
}

    // Filter tickets
    function filterTickets() {
        const statusFilter = document.getElementById('ticket-status').value;
        const priorityFilter = document.getElementById('ticket-priority').value;
        const filteredTickets = sampleTickets.filter(ticket => {
            const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
            const priorityMatch = priorityFilter === 'all' || ticket.priority === priorityFilter;
            return statusMatch && priorityMatch;
        });
        renderTickets(filteredTickets);
    }
    // Filter jobs
    function filterJobs() {
        const filter = document.getElementById('job-moderation-filter').value;
        let filtered = sampleJobs;
        if (filter !== 'all') {
            filtered = sampleJobs.filter(job => job.status === filter);
        }
        renderJobModeration(filtered);
    }

    // Initialize ticket filtering
    const ticketFilters = document.querySelectorAll('#ticket-status, #ticket-priority');
    ticketFilters.forEach(filter => {
        filter.addEventListener('change', filterTickets);
    });
    // Initialize job moderation filtering
    const jobFilter = document.getElementById('job-moderation-filter');
    if (jobFilter) jobFilter.addEventListener('change', filterJobs);
    // Initialize with default ticket and job moderation view
    renderTickets(sampleTickets);
    renderJobModeration(sampleJobs);
    renderUsers(sampleUsers);
    renderSampleSystemLogs();
    renderSampleAuditLogs();

    // Simulate system logs updates
    function updateSystemLogs() {
        const logLevels = ['info', 'warning', 'error'];
        const messages = [
            'User authentication successful',
            'Database backup completed',
            'High memory usage detected',
            'New user registered',
            'Scheduled maintenance in progress',
            'Security scan completed',
            'API response time high'
        ];
        const logContainer = document.getElementById('system-logs');
        if (!logContainer) return;
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const logLevel = logLevels[Math.floor(Math.random() * logLevels.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <span class="log-time">${timeString}</span>
            <span class="log-level ${logLevel}">${logLevel.toUpperCase()}</span>
            <span class="log-message">${message}</span>
        `;
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        // Keep only the last 10 logs
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    // Update logs every 5 seconds
    setInterval(updateSystemLogs, 5000);

    // Update response time randomly to simulate real-time monitoring
    function updateResponseTime() {
        const responseTimeElement = document.getElementById('response-time');
        if (responseTimeElement) {
            const baseTime = 50 + Math.random() * 100; // Random time between 50-150ms
            responseTimeElement.textContent = `${Math.round(baseTime)}ms`;
        }
    }
    setInterval(updateResponseTime, 2000);
    updateResponseTime();

    // Handle new ticket button
    const newTicketBtn = document.getElementById('new-ticket-btn');
    if (newTicketBtn) {
        newTicketBtn.addEventListener('click', () => {
            alert('New ticket functionality would open a form here.');
        });
    }
    // Handle add user button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            alert('Add user functionality would open a form here.');
        });
    }

    // ...existing code...

    // ...existing code...
    // Initialize admin panel tabs
    initAdminTabs();
});
