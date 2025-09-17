// --- Content Moderation Advanced Features ---
const moderationData = [
    {
        id: 'C-2001',
        user: 'John Smith',
        type: 'Comment',
        status: 'Flagged',
        reported: '2025-09-16',
        details: 'Inappropriate language in comment.'
    },
    {
        id: 'C-2002',
        user: 'Jane Doe',
        type: 'Post',
        status: 'Approved',
        reported: '2025-09-15',
        details: 'Post reviewed and approved.'
    },
    {
        id: 'C-2003',
        user: 'Alice Johnson',
        type: 'Image',
        status: 'Rejected',
        reported: '2025-09-14',
        details: 'Image contained prohibited content.'
    },
    {
        id: 'C-2004',
        user: 'Bob Lee',
        type: 'Comment',
        status: 'Flagged',
        reported: '2025-09-13',
        details: 'Spam detected in comment.'
    },
    {
        id: 'C-2005',
        user: 'Chris Evans',
        type: 'Video',
        status: 'Flagged',
        reported: '2025-09-12',
        details: 'Video under review for copyright.'
    },
    {
        id: 'C-2006',
        user: 'Dana White',
        type: 'Post',
        status: 'Approved',
        reported: '2025-09-11',
        details: 'Post approved after manual review.'
    },
    {
        id: 'C-2007',
        user: 'Eve Black',
        type: 'Image',
        status: 'Rejected',
        reported: '2025-09-10',
        details: 'Image violated guidelines.'
    }
];

function renderModerationTable() {
    const tbody = document.getElementById('moderation-table-body');
    if (!tbody) return;
    const search = (document.getElementById('admin-moderation-search')?.value || '').toLowerCase();
    const status = document.getElementById('admin-moderation-status-filter')?.value || '';
    let filtered = moderationData.filter(item => {
        let match = true;
        if (search) {
            match = (
                item.user.toLowerCase().includes(search) ||
                item.type.toLowerCase().includes(search) ||
                item.id.toLowerCase().includes(search)
            );
        }
        if (status && item.status !== status) match = false;
        return match;
    });
    tbody.innerHTML = filtered.map(item => `
        <tr>
            <td><input type="checkbox" class="admin-moderation-checkbox" value="${item.id}"></td>
            <td>#${item.id}</td>
            <td>${item.user}</td>
            <td>${item.type}</td>
            <td><span class="badge badge-${item.status === 'Flagged' ? 'warning' : item.status === 'Approved' ? 'success' : 'error'}">${item.status}</span></td>
            <td>${item.reported}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="approveContent('${item.id}')">Approve</button>
                <button class="btn btn-outline btn-sm" onclick="rejectContent('${item.id}')">Reject</button>
                <button class="btn btn-outline btn-sm" onclick="openModerationDetailModal('${item.id}')">View</button>
            </td>
        </tr>
    `).join('');
    updateModerationAnalytics(filtered);
}

function updateModerationAnalytics(filtered) {
    // Update analytics summary cards
    const flagged = filtered.filter(x => x.status === 'Flagged').length;
    const approved = filtered.filter(x => x.status === 'Approved').length;
    const rejected = filtered.filter(x => x.status === 'Rejected').length;
    const analytics = document.querySelector('.moderation-analytics-summary');
    if (analytics) {
        analytics.children[0].querySelector('div').textContent = flagged;
        analytics.children[1].querySelector('div').textContent = approved;
        analytics.children[2].querySelector('div').textContent = rejected;
    }
}

function approveContent(id) {
    const item = moderationData.find(x => x.id === id);
    if (item) item.status = 'Approved';
    renderModerationTable();
    showNotification('Content approved.');
}
function rejectContent(id) {
    const item = moderationData.find(x => x.id === id);
    if (item) item.status = 'Rejected';
    renderModerationTable();
    showNotification('Content rejected.');
}
function openModerationDetailModal(id) {
    const item = moderationData.find(x => x.id === id);
    if (!item) return;
    const modal = document.getElementById('moderation-detail-modal');
    const body = document.getElementById('moderation-detail-body');
    if (body) {
        body.innerHTML = `
            <div><b>Content ID:</b> #${item.id}</div>
            <div><b>User:</b> ${item.user}</div>
            <div><b>Type:</b> ${item.type}</div>
            <div><b>Status:</b> ${item.status}</div>
            <div><b>Reported:</b> ${item.reported}</div>
            <div><b>Details:</b> ${item.details}</div>
        `;
    }
    if (modal) modal.style.display = 'block';
}
function closeModerationDetailModal() {
    const modal = document.getElementById('moderation-detail-modal');
    if (modal) modal.style.display = 'none';
}
function exportModerationCSV() {
    let rows = [
        ['Content ID', 'User', 'Type', 'Status', 'Reported', 'Details']
    ];
    const search = (document.getElementById('admin-moderation-search')?.value || '').toLowerCase();
    const status = document.getElementById('admin-moderation-status-filter')?.value || '';
    let filtered = moderationData.filter(item => {
        let match = true;
        if (search) {
            match = (
                item.user.toLowerCase().includes(search) ||
                item.type.toLowerCase().includes(search) ||
                item.id.toLowerCase().includes(search)
            );
        }
        if (status && item.status !== status) match = false;
        return match;
    });
    filtered.forEach(item => {
        rows.push([
            item.id,
            item.user,
            item.type,
            item.status,
            item.reported,
            item.details
        ]);
    });
    let csvContent = rows.map(e => e.map(x => '"'+x.replace(/"/g,'""')+'"').join(",")).join("\n");
    let blob = new Blob([csvContent], { type: 'text/csv' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'moderation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function getSelectedModerationIds() {
    return Array.from(document.querySelectorAll('.admin-moderation-checkbox:checked')).map(cb => cb.value);
}
function bulkApproveContent() {
    const ids = getSelectedModerationIds();
    ids.forEach(id => {
        const item = moderationData.find(x => x.id === id);
        if (item) item.status = 'Approved';
    });
    renderModerationTable();
    showNotification('Selected content approved.');
}
function bulkRejectContent() {
    const ids = getSelectedModerationIds();
    ids.forEach(id => {
        const item = moderationData.find(x => x.id === id);
        if (item) item.status = 'Rejected';
    });
    renderModerationTable();
    showNotification('Selected content rejected.');
}
function bulkDeleteContent() {
    const ids = getSelectedModerationIds();
    for (let i = moderationData.length - 1; i >= 0; i--) {
        if (ids.includes(moderationData[i].id)) moderationData.splice(i, 1);
    }
    renderModerationTable();
    showNotification('Selected content deleted.');
}
function toggleSelectAllModeration(checkbox) {
    document.querySelectorAll('.admin-moderation-checkbox').forEach(cb => {
        cb.checked = checkbox.checked;
    });
}

// Event listeners for search/filter
document.addEventListener('DOMContentLoaded', function() {
    const search = document.getElementById('admin-moderation-search');
    const filter = document.getElementById('admin-moderation-status-filter');
    if (search) search.addEventListener('input', renderModerationTable);
    if (filter) filter.addEventListener('change', renderModerationTable);
    renderModerationTable();
});

// Expose functions for inline HTML event handlers
window.approveContent = approveContent;
window.rejectContent = rejectContent;
window.openModerationDetailModal = openModerationDetailModal;
window.closeModerationDetailModal = closeModerationDetailModal;
window.exportModerationCSV = exportModerationCSV;
window.bulkApproveContent = bulkApproveContent;
window.bulkRejectContent = bulkRejectContent;
window.bulkDeleteContent = bulkDeleteContent;
window.toggleSelectAllModeration = toggleSelectAllModeration;
// --- Audit Logs Analytics Pie Chart ---
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('audit-pie-chart');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        // Demo: 1 success, 1 deleted
        const data = [1, 1];
        const colors = ['#10b981', '#ef4444'];
        let total = data.reduce((a, b) => a + b, 0);
        let start = 0;
        data.forEach((val, i) => {
            const angle = (val / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(60, 60);
            ctx.arc(60, 60, 55, start, start + angle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            start += angle;
        });
    }
});
// --- Audit Logs & Compliance Advanced Features ---
document.addEventListener('DOMContentLoaded', function() {
    // Audit log search/filter
    const search = document.getElementById('admin-audit-search');
    const statusFilter = document.getElementById('admin-audit-status-filter');
    if (search) search.addEventListener('input', filterAuditLogsTable);
    if (statusFilter) statusFilter.addEventListener('change', filterAuditLogsTable);
});

function filterAuditLogsTable() {
    const search = document.getElementById('admin-audit-search').value.toLowerCase();
    const status = document.getElementById('admin-audit-status-filter').value;
    document.querySelectorAll('#audit-table-body tr').forEach(row => {
        const user = row.children[2]?.textContent.toLowerCase();
        const action = row.children[3]?.textContent.toLowerCase();
        const stat = row.children[4]?.textContent;
        let show = true;
        if (search && !(user.includes(search) || action.includes(search))) show = false;
        if (status && !stat.includes(status)) show = false;
        row.style.display = show ? '' : 'none';
    });
}

function exportAuditLogsCSV() {
    let csv = 'Timestamp,User,Action,Status\n';
    document.querySelectorAll('#audit-table-body tr').forEach(row => {
        const t = row.children[1]?.textContent;
        const u = row.children[2]?.textContent;
        const a = row.children[3]?.textContent;
        const s = row.children[4]?.textContent;
        csv += `"${t}","${u}","${a}","${s}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function getSelectedAuditLogIds() {
    return Array.from(document.querySelectorAll('.admin-audit-checkbox:checked')).map(cb => cb.value);
}

function bulkDeleteAuditLogs() {
    const ids = getSelectedAuditLogIds();
    if (!ids.length) return showNotification('No logs selected.', 'warning');
    if (!confirm('Are you sure you want to delete selected logs?')) return;
    document.querySelectorAll('#audit-table-body tr').forEach(row => {
        if (ids.includes(row.querySelector('.admin-audit-checkbox').value)) row.remove();
    });
    showNotification('Selected logs deleted.', 'success');
}

function toggleSelectAllAuditLogs(checkbox) {
    document.querySelectorAll('.admin-audit-checkbox').forEach(cb => { cb.checked = checkbox.checked; });
}

function openAuditLogDetailModal(id) {
    const modal = document.getElementById('audit-log-detail-modal');
    const body = document.getElementById('audit-log-detail-body');
    if (!modal || !body) return;
    // For demo, use static data. In real app, fetch from storage/server.
    const logs = {
        1: { timestamp: '2025-09-17 10:15', user: 'Jane Doe', action: 'User Login', status: 'Success', details: 'User successfully logged in from IP 192.168.1.10.' },
        2: { timestamp: '2025-09-17 10:20', user: 'Admin', action: 'Deleted Job #5', status: 'Deleted', details: 'Admin deleted job posting #5. Action performed from dashboard.' }
    };
    const log = logs[id];
    if (!log) return;
    body.innerHTML = `
        <div style="margin-bottom:0.75rem;"><strong>Timestamp:</strong> ${log.timestamp}</div>
        <div style="margin-bottom:0.75rem;"><strong>User:</strong> ${log.user}</div>
        <div style="margin-bottom:0.75rem;"><strong>Action:</strong> ${log.action}</div>
        <div style="margin-bottom:0.75rem;"><strong>Status:</strong> <span class="badge badge-${log.status === 'Success' ? 'success' : 'error'}">${log.status}</span></div>
        <div style="margin-bottom:0.75rem;"><strong>Details:</strong> ${log.details}</div>
    `;
    modal.classList.add('active');
}
function closeAuditLogDetailModal() {
    document.getElementById('audit-log-detail-modal').classList.remove('active');
}

function openComplianceChecklistModal() {
    document.getElementById('compliance-checklist-modal').classList.add('active');
}
function closeComplianceChecklistModal() {
    document.getElementById('compliance-checklist-modal').classList.remove('active');
}

window.exportAuditLogsCSV = exportAuditLogsCSV;
window.bulkDeleteAuditLogs = bulkDeleteAuditLogs;
window.toggleSelectAllAuditLogs = toggleSelectAllAuditLogs;
window.openAuditLogDetailModal = openAuditLogDetailModal;
window.closeAuditLogDetailModal = closeAuditLogDetailModal;
window.openComplianceChecklistModal = openComplianceChecklistModal;
window.closeComplianceChecklistModal = closeComplianceChecklistModal;
// --- Backup & Drill: History, Restore Simulation, Notifications ---
function openBackupHistoryModal() {
    const modal = document.getElementById('backup-history-modal');
    const list = document.getElementById('backup-history-list');
    if (!modal || !list) return;
    // For demo, use static data. In real app, fetch from storage/server.
    const backups = [
        { date: '2025-09-17 09:00', type: 'Full Backup', status: 'Completed', details: 'Backup completed successfully.' },
        { date: '2025-09-16 15:30', type: 'Drill', status: 'In Progress', details: 'Drill is running.' },
        { date: '2025-09-15 12:00', type: 'Full Backup', status: 'Completed', details: 'Backup completed successfully.' }
    ];
    list.innerHTML = backups.map(b => `
        <div style="padding:0.75rem 0;border-bottom:1px solid #e5e7eb;">
            <strong>${b.date}</strong> &mdash; <span style="color:var(--primary);font-weight:500;">${b.type}</span> &mdash; <span class="badge badge-${b.status === 'Completed' ? 'success' : 'warning'}">${b.status}</span><br>
            <span style="font-size:0.95em;color:var(--gray-600);">${b.details}</span>
        </div>
    `).join('');
    modal.classList.add('active');
}
function closeBackupHistoryModal() {
    document.getElementById('backup-history-modal').classList.remove('active');
}

function restoreBackup(date) {
    // Show restore simulation modal and progress
    const modal = document.getElementById('restore-sim-modal');
    const bar = document.getElementById('restore-progress-bar');
    const inner = document.getElementById('restore-progress-inner');
    const label = document.getElementById('restore-progress-label');
    if (!modal || !bar || !inner || !label) return;
    modal.classList.add('active');
    inner.style.width = '0%';
    label.textContent = 'Restoring backup...';
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25 + 15;
        if (progress >= 100) {
            inner.style.width = '100%';
            label.textContent = 'Restore completed!';
            setTimeout(() => { modal.classList.remove('active'); }, 1200);
            showNotification(`Backup from ${date} restored successfully!`, 'success');
            clearInterval(interval);
        } else {
            inner.style.width = Math.min(progress, 100) + '%';
        }
    }, 400);
}

window.openBackupHistoryModal = openBackupHistoryModal;
window.closeBackupHistoryModal = closeBackupHistoryModal;
window.restoreBackup = restoreBackup;
// --- Backup & Drill Advanced Features ---
function showScheduleBackupModal() {
    document.getElementById('schedule-backup-modal').classList.add('active');
}
function closeScheduleBackupModal() {
    document.getElementById('schedule-backup-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    // Schedule backup form
    const scheduleForm = document.getElementById('schedule-backup-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const dt = document.getElementById('schedule-backup-datetime').value;
            const type = document.getElementById('schedule-backup-type').value;
            showNotification(`Backup scheduled for ${new Date(dt).toLocaleString()} (${type})`, 'success');
            closeScheduleBackupModal();
        });
    }
    // Backup table filtering
    const typeFilter = document.getElementById('backup-type-filter');
    const statusFilter = document.getElementById('backup-status-filter');
    if (typeFilter) typeFilter.addEventListener('change', filterBackupTable);
    if (statusFilter) statusFilter.addEventListener('change', filterBackupTable);
});

function filterBackupTable() {
    const type = document.getElementById('backup-type-filter').value;
    const status = document.getElementById('backup-status-filter').value;
    document.querySelectorAll('#backup-table-body tr').forEach(row => {
        const t = row.children[1]?.textContent;
        const s = row.children[2]?.textContent;
        let show = true;
        if (type && t !== type) show = false;
        if (status && !s.includes(status)) show = false;
        row.style.display = show ? '' : 'none';
    });
}

// Simulate backup progress bar (for demo)
function showBackupProgress(label = 'Running backup...') {
    const bar = document.getElementById('backup-progress-bar');
    const inner = document.getElementById('backup-progress-inner');
    const text = document.getElementById('backup-progress-label');
    if (!bar || !inner || !text) return;
    bar.style.display = '';
    inner.style.width = '0%';
    text.textContent = label;
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
            inner.style.width = '100%';
            text.textContent = 'Backup completed!';
            setTimeout(() => { bar.style.display = 'none'; }, 1200);
            clearInterval(interval);
        } else {
            inner.style.width = Math.min(progress, 100) + '%';
        }
    }, 400);
}

// Demo: show progress bar when running backup/drill
window.runBackup = function() { showBackupProgress('Running backup...'); showNotification('Backup started successfully!', 'success'); };
window.runDrill = function() { showBackupProgress('Running drill...'); showNotification('Drill started!', 'success'); };
window.showScheduleBackupModal = showScheduleBackupModal;
window.closeScheduleBackupModal = closeScheduleBackupModal;
// Add Job Modal Logic
function openAddJobModal() {
    document.getElementById('add-job-modal').classList.add('active');
}
function closeAddJobModal() {
    document.getElementById('add-job-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    const addJobForm = document.getElementById('add-job-form');
    if (addJobForm) {
        addJobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const job = {
                id: jobs.length + 1,
                title: document.getElementById('add-job-title').value,
                company: document.getElementById('add-job-company').value,
                location: document.getElementById('add-job-location').value,
                category: document.getElementById('add-job-category').value,
                type: document.getElementById('add-job-type').value,
                salary: document.getElementById('add-job-salary').value,
                description: document.getElementById('add-job-description').value,
                requirements: document.getElementById('add-job-requirements').value,
                posted: new Date(),
                featured: false,
                status: 'active',
                experience: 'mid'
            };
            jobs.push(job);
            localStorage.setItem('jobs', JSON.stringify(jobs));
            showNotification('Job added successfully!', 'success');
            closeAddJobModal();
            renderJobsTable && renderJobsTable();
            renderAllJobs && renderAllJobs();
        });
    }
});
window.openAddJobModal = openAddJobModal;
window.closeAddJobModal = closeAddJobModal;
// Add User Modal Logic
function openAddUserModal() {
    document.getElementById('add-user-modal').classList.add('active');
}
function closeAddUserModal() {
    document.getElementById('add-user-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('add-user-name').value;
            const email = document.getElementById('add-user-email').value;
            const type = document.getElementById('add-user-type').value;
            if (users.find(u => u.email === email)) {
                showNotification('Email already exists', 'error');
                return;
            }
            const user = {
                id: users.length + 1,
                name,
                email,
                type,
                joined: new Date(),
                status: 'active'
            };
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            showNotification('User added successfully!', 'success');
            closeAddUserModal();
            renderUsersTable && renderUsersTable();
            updateAdminStats && updateAdminStats();
        });
    }
});
window.openAddUserModal = openAddUserModal;
window.closeAddUserModal = closeAddUserModal;
// --- Backup & Drill Tab Handlers ---
function runBackup() {
    showNotification('Backup started successfully!', 'success');
}
function restoreBackup() {
    showNotification('Restore process initiated.', 'info');
}
function runDrill() {
    showNotification('Disaster recovery drill started.', 'success');
}
function exportBackupLog() {
    showNotification('Backup log exported.', 'success');
}
function viewBackup(date) {
    showNotification(`Viewing backup from ${date}.`, 'info');
}
function deleteBackup(date) {
    if (confirm('Are you sure you want to delete this backup?')) {
        showNotification(`Backup from ${date} deleted.`, 'success');
    }
}

window.runBackup = runBackup;
window.restoreBackup = restoreBackup;
window.runDrill = runDrill;
window.exportBackupLog = exportBackupLog;
window.viewBackup = viewBackup;
window.deleteBackup = deleteBackup;
// --- Admin Tab Interactive Handlers ---
function resolveTicket(ticketId) {
    showNotification(`Ticket #${ticketId} marked as resolved!`, 'success');
}
function viewTicket(ticketId) {
    showNotification(`Viewing details for ticket #${ticketId}.`, 'info');
}
function deleteTicket(ticketId) {
    if (confirm('Are you sure you want to delete this ticket?')) {
        showNotification(`Ticket #${ticketId} deleted.`, 'success');
    }
}
function approveContent(contentId) {
    showNotification(`Content ${contentId} approved.`, 'success');
}
function rejectContent(contentId) {
    showNotification(`Content ${contentId} rejected.`, 'error');
}
function viewContent(contentId) {
    showNotification(`Viewing content ${contentId}.`, 'info');
}
function refreshSystemHealth() {
    showNotification('System health data refreshed.', 'success');
}
function exportHealthReport() {
    showNotification('System health report exported.', 'success');
}

// Expose for inline HTML usage
window.resolveTicket = resolveTicket;
window.viewTicket = viewTicket;
window.deleteTicket = deleteTicket;
window.approveContent = approveContent;
window.rejectContent = rejectContent;
window.viewContent = viewContent;
window.refreshSystemHealth = refreshSystemHealth;
window.exportHealthReport = exportHealthReport;
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
    // Get filter/search values
    const search = document.getElementById('admin-user-search')?.value?.toLowerCase() || '';
    const typeFilter = document.getElementById('admin-user-type-filter')?.value || '';
    let filteredUsers = users.filter(u => {
        const matchesSearch = !search || u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
        const matchesType = !typeFilter || u.type === typeFilter;
        return matchesSearch && matchesType;
    });
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td><input type="checkbox" class="admin-user-checkbox" value="${user.id}"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.type.charAt(0).toUpperCase() + user.type.slice(1)}</td>
            <td>${new Date(user.joined).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewUserDetails(${user.id})">View</button>
                    <button class="btn btn-outline btn-sm" onclick="openEditUserModal(${user.id})">Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="toggleUserStatus(${user.id})">
                        ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
// Edit user modal logic
function openEditUserModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-user-name').value = user.name;
    document.getElementById('edit-user-email').value = user.email;
    document.getElementById('edit-user-type').value = user.type;
    document.getElementById('edit-user-status').value = user.status;
    document.getElementById('edit-user-modal').classList.add('active');
}
function closeEditUserModal() {
    document.getElementById('edit-user-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    const editUserForm = document.getElementById('edit-user-form');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-user-id').value);
            const name = document.getElementById('edit-user-name').value;
            const email = document.getElementById('edit-user-email').value;
            const type = document.getElementById('edit-user-type').value;
            const status = document.getElementById('edit-user-status').value;
            const user = users.find(u => u.id === id);
            if (user) {
                user.name = name;
                user.email = email;
                user.type = type;
                user.status = status;
                localStorage.setItem('users', JSON.stringify(users));
                renderUsersTable();
                updateAdminStats && updateAdminStats();
                showNotification('User updated successfully!', 'success');
                closeEditUserModal();
            }
        });
    }
});
window.openEditUserModal = openEditUserModal;
window.closeEditUserModal = closeEditUserModal;
// Admin user tab: search, filter, export, bulk actions, select all, view details
document.addEventListener('DOMContentLoaded', function() {
    const search = document.getElementById('admin-user-search');
    const typeFilter = document.getElementById('admin-user-type-filter');
    if (search) search.addEventListener('input', renderUsersTable);
    if (typeFilter) typeFilter.addEventListener('change', renderUsersTable);
});

function exportUsersCSV() {
    let csv = 'Name,Email,Type,Joined,Status\n';
    users.forEach(u => {
        csv += `"${u.name}","${u.email}","${u.type}","${new Date(u.joined).toLocaleDateString()}","${u.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function getSelectedUserIds() {
    return Array.from(document.querySelectorAll('.admin-user-checkbox:checked')).map(cb => parseInt(cb.value));
}

function bulkDeactivateUsers() {
    const ids = getSelectedUserIds();
    if (!ids.length) return showNotification('No users selected.', 'warning');
    users.forEach(u => { if (ids.includes(u.id)) u.status = 'inactive'; });
    localStorage.setItem('users', JSON.stringify(users));
    renderUsersTable();
    updateAdminStats && updateAdminStats();
    showNotification('Selected users deactivated.', 'success');
}

function bulkDeleteUsers() {
    const ids = getSelectedUserIds();
    if (!ids.length) return showNotification('No users selected.', 'warning');
    if (!confirm('Are you sure you want to delete selected users?')) return;
    users = users.filter(u => !ids.includes(u.id));
    localStorage.setItem('users', JSON.stringify(users));
    renderUsersTable();
    updateAdminStats && updateAdminStats();
    showNotification('Selected users deleted.', 'success');
}

function toggleSelectAllUsers(checkbox) {
    document.querySelectorAll('.admin-user-checkbox').forEach(cb => { cb.checked = checkbox.checked; });
}

function viewUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nType: ${user.type}\nJoined: ${new Date(user.joined).toLocaleDateString()}\nStatus: ${user.status}`);
}

window.exportUsersCSV = exportUsersCSV;
window.bulkDeactivateUsers = bulkDeactivateUsers;
window.bulkDeleteUsers = bulkDeleteUsers;
window.toggleSelectAllUsers = toggleSelectAllUsers;
window.viewUserDetails = viewUserDetails;
}

function renderJobsTable() {
// Admin job tab: search, filter, export, bulk actions, select all, view details
document.addEventListener('DOMContentLoaded', function() {
    const search = document.getElementById('admin-job-search');
    const statusFilter = document.getElementById('admin-job-status-filter');
    if (search) search.addEventListener('input', renderJobsTable);
    if (statusFilter) statusFilter.addEventListener('change', renderJobsTable);
});

function exportJobsCSV() {
    let csv = 'Title,Company,Category,Location,Type,Salary,Status,Posted\n';
    jobs.forEach(j => {
        csv += `"${j.title}","${j.company}","${j.category}","${j.location}","${j.type}","${j.salary}","${j.status}","${new Date(j.posted).toLocaleDateString()}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function getSelectedJobIds() {
    return Array.from(document.querySelectorAll('.admin-job-checkbox:checked')).map(cb => parseInt(cb.value));
}

function bulkActivateJobs() {
    const ids = getSelectedJobIds();
    if (!ids.length) return showNotification('No jobs selected.', 'warning');
    jobs.forEach(j => { if (ids.includes(j.id)) j.status = 'active'; });
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobsTable();
    showNotification('Selected jobs activated.', 'success');
}

function bulkDeactivateJobs() {
    const ids = getSelectedJobIds();
    if (!ids.length) return showNotification('No jobs selected.', 'warning');
    jobs.forEach(j => { if (ids.includes(j.id)) j.status = 'inactive'; });
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobsTable();
    showNotification('Selected jobs deactivated.', 'success');
}

function bulkDeleteJobs() {
    const ids = getSelectedJobIds();
    if (!ids.length) return showNotification('No jobs selected.', 'warning');
    if (!confirm('Are you sure you want to delete selected jobs?')) return;
    jobs = jobs.filter(j => !ids.includes(j.id));
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobsTable();
    showNotification('Selected jobs deleted.', 'success');
}

function toggleSelectAllJobs(checkbox) {
    document.querySelectorAll('.admin-job-checkbox').forEach(cb => { cb.checked = checkbox.checked; });
}

function viewJobDetails(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    alert(`Job Details:\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nCategory: ${job.category}\nType: ${job.type}\nSalary: ${job.salary}\nStatus: ${job.status}`);
}

window.exportJobsCSV = exportJobsCSV;
window.bulkActivateJobs = bulkActivateJobs;
window.bulkDeactivateJobs = bulkDeactivateJobs;
window.bulkDeleteJobs = bulkDeleteJobs;
window.toggleSelectAllJobs = toggleSelectAllJobs;
window.viewJobDetails = viewJobDetails;
    const tbody = document.getElementById('admin-jobs-table-body');
    // Get filter/search values
    const search = document.getElementById('admin-job-search')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('admin-job-status-filter')?.value || '';
    let filteredJobs = jobs.filter(j => {
        const matchesSearch = !search || j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search);
        const matchesStatus = !statusFilter || j.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    tbody.innerHTML = filteredJobs.map(job => `
        <tr>
            <td><input type="checkbox" class="admin-job-checkbox" value="${job.id}"></td>
            <td>${job.title}</td>
            <td>${job.company}</td>
            <td>${job.category}</td>
            <td>${new Date(job.posted).toLocaleDateString()}</td>
            <td>${job.status}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewJobDetails(${job.id})">View</button>
                    <button class="btn btn-outline btn-sm" onclick="openEditJobModal(${job.id})">Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="toggleJobStatus(${job.id})">
                        ${job.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteJob(${job.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
// Edit job modal logic
function openEditJobModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    document.getElementById('edit-job-id').value = job.id;
    document.getElementById('edit-job-title').value = job.title;
    document.getElementById('edit-job-company').value = job.company;
    document.getElementById('edit-job-location').value = job.location;
    document.getElementById('edit-job-category').value = job.category;
    document.getElementById('edit-job-type').value = job.type;
    document.getElementById('edit-job-salary').value = job.salary;
    document.getElementById('edit-job-description').value = job.description;
    document.getElementById('edit-job-requirements').value = job.requirements;
    document.getElementById('edit-job-status').value = job.status;
    document.getElementById('edit-job-modal').classList.add('active');
}
function closeEditJobModal() {
    document.getElementById('edit-job-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    const editJobForm = document.getElementById('edit-job-form');
    if (editJobForm) {
        editJobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-job-id').value);
            const job = jobs.find(j => j.id === id);
            if (job) {
                job.title = document.getElementById('edit-job-title').value;
                job.company = document.getElementById('edit-job-company').value;
                job.location = document.getElementById('edit-job-location').value;
                job.category = document.getElementById('edit-job-category').value;
                job.type = document.getElementById('edit-job-type').value;
                job.salary = document.getElementById('edit-job-salary').value;
                job.description = document.getElementById('edit-job-description').value;
                job.requirements = document.getElementById('edit-job-requirements').value;
                job.status = document.getElementById('edit-job-status').value;
                localStorage.setItem('jobs', JSON.stringify(jobs));
                renderJobsTable();
                renderAllJobs && renderAllJobs();
                showNotification('Job updated successfully!', 'success');
                closeEditJobModal();
            }
        });
    }
});
window.openEditJobModal = openEditJobModal;
window.closeEditJobModal = closeEditJobModal;
}

function renderCompaniesTable() {
// Admin company tab: search, filter, export, bulk actions, select all, view details, add/edit modals
document.addEventListener('DOMContentLoaded', function() {
    const search = document.getElementById('admin-company-search');
    const statusFilter = document.getElementById('admin-company-status-filter');
    if (search) search.addEventListener('input', renderCompaniesTable);
    if (statusFilter) statusFilter.addEventListener('change', renderCompaniesTable);

    // Add company modal
    const addCompanyForm = document.getElementById('add-company-form');
    if (addCompanyForm) {
        addCompanyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('add-company-name').value;
            const industry = document.getElementById('add-company-industry').value;
            const description = document.getElementById('add-company-description').value;
            if (companies.find(c => c.name === name)) {
                showNotification('Company already exists', 'error');
                return;
            }
            const company = {
                id: companies.length + 1,
                name,
                industry,
                description,
                jobsPosted: 0,
                status: 'active',
                logo: '🏢'
            };
            companies.push(company);
            localStorage.setItem('companies', JSON.stringify(companies));
            showNotification('Company added successfully!', 'success');
            closeAddCompanyModal();
            renderCompaniesTable && renderCompaniesTable();
            renderCompanies && renderCompanies();
        });
    }

    // Edit company modal
    const editCompanyForm = document.getElementById('edit-company-form');
    if (editCompanyForm) {
        editCompanyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('edit-company-id').value);
            const company = companies.find(c => c.id === id);
            if (company) {
                company.name = document.getElementById('edit-company-name').value;
                company.industry = document.getElementById('edit-company-industry').value;
                company.description = document.getElementById('edit-company-description').value;
                company.status = document.getElementById('edit-company-status').value;
                localStorage.setItem('companies', JSON.stringify(companies));
                renderCompaniesTable();
                renderCompanies && renderCompanies();
                showNotification('Company updated successfully!', 'success');
                closeEditCompanyModal();
            }
        });
    }
});

function exportCompaniesCSV() {
    let csv = 'Name,Industry,Description,Jobs Posted,Status\n';
    companies.forEach(c => {
        csv += `"${c.name}","${c.industry}","${c.description}","${c.jobsPosted}","${c.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies.csv';
    a.click();
    URL.revokeObjectURL(url);
}

function getSelectedCompanyIds() {
    return Array.from(document.querySelectorAll('.admin-company-checkbox:checked')).map(cb => parseInt(cb.value));
}

function bulkActivateCompanies() {
    const ids = getSelectedCompanyIds();
    if (!ids.length) return showNotification('No companies selected.', 'warning');
    companies.forEach(c => { if (ids.includes(c.id)) c.status = 'active'; });
    localStorage.setItem('companies', JSON.stringify(companies));
    renderCompaniesTable();
    showNotification('Selected companies activated.', 'success');
}

function bulkDeactivateCompanies() {
    const ids = getSelectedCompanyIds();
    if (!ids.length) return showNotification('No companies selected.', 'warning');
    companies.forEach(c => { if (ids.includes(c.id)) c.status = 'inactive'; });
    localStorage.setItem('companies', JSON.stringify(companies));
    renderCompaniesTable();
    showNotification('Selected companies deactivated.', 'success');
}

function bulkDeleteCompanies() {
    const ids = getSelectedCompanyIds();
    if (!ids.length) return showNotification('No companies selected.', 'warning');
    if (!confirm('Are you sure you want to delete selected companies?')) return;
    companies = companies.filter(c => !ids.includes(c.id));
    localStorage.setItem('companies', JSON.stringify(companies));
    renderCompaniesTable();
    showNotification('Selected companies deleted.', 'success');
}

function toggleSelectAllCompanies(checkbox) {
    document.querySelectorAll('.admin-company-checkbox').forEach(cb => { cb.checked = checkbox.checked; });
}

function viewCompanyDetails(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    alert(`Company Details:\nName: ${company.name}\nIndustry: ${company.industry}\nDescription: ${company.description}\nJobs Posted: ${company.jobsPosted}\nStatus: ${company.status}`);
}

function openEditCompanyModal(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    document.getElementById('edit-company-id').value = company.id;
    document.getElementById('edit-company-name').value = company.name;
    document.getElementById('edit-company-industry').value = company.industry;
    document.getElementById('edit-company-description').value = company.description;
    document.getElementById('edit-company-status').value = company.status;
    document.getElementById('edit-company-modal').classList.add('active');
}
function closeEditCompanyModal() {
    document.getElementById('edit-company-modal').classList.remove('active');
}
function openAddCompanyModal() {
    document.getElementById('add-company-modal').classList.add('active');
}
function closeAddCompanyModal() {
    document.getElementById('add-company-modal').classList.remove('active');
}

window.exportCompaniesCSV = exportCompaniesCSV;
window.bulkActivateCompanies = bulkActivateCompanies;
window.bulkDeactivateCompanies = bulkDeactivateCompanies;
window.bulkDeleteCompanies = bulkDeleteCompanies;
window.toggleSelectAllCompanies = toggleSelectAllCompanies;
window.viewCompanyDetails = viewCompanyDetails;
window.openEditCompanyModal = openEditCompanyModal;
window.closeEditCompanyModal = closeEditCompanyModal;
window.openAddCompanyModal = openAddCompanyModal;
window.closeAddCompanyModal = closeAddCompanyModal;
    const tbody = document.getElementById('admin-companies-table-body');
    // Get filter/search values
    const search = document.getElementById('admin-company-search')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('admin-company-status-filter')?.value || '';
    let filteredCompanies = companies.filter(c => {
        const matchesSearch = !search || c.name.toLowerCase().includes(search) || c.industry.toLowerCase().includes(search);
        const matchesStatus = !statusFilter || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    tbody.innerHTML = filteredCompanies.map(company => `
        <tr>
            <td><input type="checkbox" class="admin-company-checkbox" value="${company.id}"></td>
            <td>${company.name}</td>
            <td>${company.industry}</td>
            <td>${company.jobsPosted}</td>
            <td>${company.status}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewCompanyDetails(${company.id})">View</button>
                    <button class="btn btn-outline btn-sm" onclick="openEditCompanyModal(${company.id})">Edit</button>
                    <button class="btn btn-outline btn-sm" onclick="toggleCompanyStatus(${company.id})">
                        ${company.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="deleteCompany(${company.id})">Delete</button>
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