// --- Audit Logs & Compliance Section ---
const auditLogsData = [
    { date: '2025-09-09', user: 'Alex Admin', action: 'Login', details: 'Successful login from 192.168.1.10' },
    { date: '2025-09-09', user: 'Alex Admin', action: 'Approved job', details: 'Job: UX Designer' },
    { date: '2025-09-08', user: 'Bob Smith', action: 'Suspended user', details: 'User: Carol Lee' },
    { date: '2025-09-08', user: 'Alex Admin', action: 'Changed password', details: 'Password updated for security' },
    { date: '2025-09-07', user: 'Eva Green', action: 'Deleted job', details: 'Job: Junior Developer' }
];
function renderAuditLogsTable() {
    const container = document.getElementById('auditLogsTableContainer');
    if (!container) return;
    const date = document.getElementById('auditLogDateFilter')?.value;
    const user = document.getElementById('auditLogUserFilter')?.value.toLowerCase() || '';
    const action = document.getElementById('auditLogActionFilter')?.value.toLowerCase() || '';
    let filtered = auditLogsData.filter(l => {
        if (date && l.date !== date) return false;
        if (user && !l.user.toLowerCase().includes(user)) return false;
        if (action && !l.action.toLowerCase().includes(action)) return false;
        return true;
    });
    if (!filtered.length) {
        container.innerHTML = '<div style="color:#888;font-size:1.05rem;">No logs found for the selected filters.</div>';
        return;
    }
    container.innerHTML = `<table class="data-table" style="width:100%;min-width:600px;">
        <thead>
            <tr><th>Date</th><th>User</th><th>Action</th><th>Details</th></tr>
        </thead>
        <tbody>
            ${filtered.map(l => `<tr><td>${l.date}</td><td>${l.user}</td><td>${l.action}</td><td>${l.details}</td></tr>`).join('')}
        </tbody>
    </table>`;
}
['auditLogDateFilter','auditLogUserFilter','auditLogActionFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', renderAuditLogsTable);
        el.addEventListener('change', renderAuditLogsTable);
    }
});
document.addEventListener('DOMContentLoaded', renderAuditLogsTable);
