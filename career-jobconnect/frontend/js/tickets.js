// Tickets Management System
function initializeTickets() {
    // Load tickets from JSON on first run if not present
    if (!localStorage.getItem('cj_tickets')) {
        fetch('../assets/tickets.json')
            .then(r => r.json())
            .then(data => {
                localStorage.setItem('cj_tickets', JSON.stringify(data));
                renderTickets();
            })
            .catch(error => {
                console.error('Error loading tickets:', error);
                showNotification('Error loading tickets. Using empty list.');
                renderTickets();
            });
    } else {
        renderTickets();
    }
}

function renderTickets() {
    const container = document.getElementById('ticketsTableContainer');
    if (!container) return;
    
    let tickets = [];
    try {
        tickets = JSON.parse(localStorage.getItem('cj_tickets')) || [];
    } catch {
        tickets = [];
    }

    if (!tickets.length) {
        container.innerHTML = '<div style="color:#888;font-size:1.05rem;text-align:center;padding:2rem;">No support tickets found.</div>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="tickets-table" style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,204,0.04);">
                <thead>
                    <tr style="background:#f7f9fc;color:#0077cc;font-weight:600;">
                        <th style="padding:0.7rem 1rem;text-align:left;">Subject</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">User</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">Status</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">Priority</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">Assigned</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">Created</th>
                        <th style="padding:0.7rem 1rem;text-align:left;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tickets.map((ticket, idx) => `
                        <tr data-idx="${idx}" style="border-top:1px solid #eee;">
                            <td style="padding:0.7rem 1rem;">${ticket.subject || 'No subject'}</td>
                            <td style="padding:0.7rem 1rem;">${ticket.userEmail || 'N/A'}</td>
                            <td style="padding:0.7rem 1rem;">
                                <span class="status-badge" style="background:${getStatusColor(ticket.status)};color:#fff;padding:0.2rem 0.6rem;border-radius:12px;font-size:0.85rem;font-weight:500;">
                                    ${ticket.status || 'Open'}
                                </span>
                            </td>
                            <td style="padding:0.7rem 1rem;">
                                <span style="color:${getPriorityColor(ticket.priority)};font-weight:500;">
                                    ${ticket.priority || 'Medium'}
                                </span>
                            </td>
                            <td style="padding:0.7rem 1rem;">${ticket.assignedTo || '-'}</td>
                            <td style="padding:0.7rem 1rem;">${ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</td>
                            <td style="padding:0.7rem 1rem;white-space:nowrap;">
                                <button class="assign-ticket-btn btn btn-sm btn-warning" data-idx="${idx}">Assign to Me</button>
                                <button class="add-note-btn btn btn-sm btn-info" data-idx="${idx}">Add Note</button>
                                <button class="view-ticket-btn btn btn-sm btn-primary" data-idx="${idx}">View</button>
                                ${ticket.status !== 'Closed' ? 
                                    `<button class="close-ticket-btn btn btn-sm btn-danger" data-idx="${idx}">Close</button>` : 
                                    '<span class="btn btn-sm btn-disabled" style="opacity:0.6;">Closed</span>'
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Add event listeners
    setupTicketEventListeners(tickets);
}

function setupTicketEventListeners(tickets) {
    // Get current admin user
    const admin = (() => {
        try {
            const user = JSON.parse(localStorage.getItem('cj_current_user') || 'null');
            if (user && user.role === 'Admin') return user.name || user.email;
        } catch {}
        return 'Admin';
    })();

    // Assign to me
    document.querySelectorAll('.assign-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            if (tickets[idx].assignedTo === admin) {
                showNotification('You are already assigned to this ticket.');
                return;
            }
            tickets[idx].assignedTo = admin;
            localStorage.setItem('cj_tickets', JSON.stringify(tickets));
            showNotification('Ticket assigned to you.');
            renderTickets();
        });
    });

    // Add note
    document.querySelectorAll('.add-note-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const note = prompt('Enter note to add to this ticket:');
            if (note && note.trim()) {
                if (!tickets[idx].adminNotes) tickets[idx].adminNotes = [];
                tickets[idx].adminNotes.push({
                    date: new Date().toISOString(),
                    admin: admin,
                    note: note.trim()
                });
                localStorage.setItem('cj_tickets', JSON.stringify(tickets));
                showNotification('Note added to ticket.');
                renderTickets();
            }
        });
    });

    // View ticket
    document.querySelectorAll('.view-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const t = tickets[idx];
            let adminNotes = '';
            
            if (t.adminNotes && t.adminNotes.length) {
                adminNotes = '\n\nAdmin Notes:\n' + 
                    t.adminNotes.map(n => 
                        `- [${new Date(n.date).toLocaleString()}] ${n.admin}: ${n.note}`
                    ).join('\n');
            }
            
            alert(
                `Subject: ${t.subject}\n` +
                `User: ${t.userEmail}\n` +
                `Status: ${t.status}\n` +
                `Priority: ${t.priority}\n` +
                `Assigned: ${t.assignedTo || '-'}\n` +
                `Created: ${t.createdAt ? new Date(t.createdAt).toLocaleString() : 'N/A'}\n\n` +
                `Description: ${t.description || 'No description'}\n\n` +
                `Updates:\n${
                    t.updates && t.updates.length 
                        ? t.updates.map(u => `- [${new Date(u.date).toLocaleString()}] ${u.message}`).join('\n')
                        : 'No updates yet.'
                }${adminNotes}`
            );
        });
    });

    // Close ticket
    document.querySelectorAll('.close-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            if (tickets[idx].status === 'Closed') {
                showNotification('Ticket is already closed.');
                return;
            }
            if (confirm('Are you sure you want to close this ticket?')) {
                tickets[idx].status = 'Closed';
                localStorage.setItem('cj_tickets', JSON.stringify(tickets));
                showNotification('Ticket closed successfully.');
                renderTickets();
            }
        });
    });
}

// Helper functions
function getStatusColor(status) {
    const colors = {
        'Open': '#0077cc',
        'In Progress': '#ff9800',
        'Pending': '#9c27b0',
        'Closed': '#4caf50',
        'Resolved': '#4caf50'
    };
    return colors[status] || '#666';
}

function getPriorityColor(priority) {
    const colors = {
        'High': '#f44336',
        'Medium': '#ff9800',
        'Low': '#4caf50'
    };
    return colors[priority] || '#666';
}

// Initialize ticket creation modal
document.addEventListener('DOMContentLoaded', function() {
    const ticketModal = document.getElementById('ticketModal');
    const openTicketModalBtn = document.getElementById('createTicketBtn');
    const cancelTicketBtn = document.getElementById('cancelTicketBtn');
    const createTicketForm = document.getElementById('createTicketForm');

    if (openTicketModalBtn) {
        openTicketModalBtn.addEventListener('click', function() {
            ticketModal.style.display = 'flex';
        });
    }

    if (cancelTicketBtn) {
        cancelTicketBtn.addEventListener('click', function() {
            ticketModal.style.display = 'none';
        });
    }

    if (createTicketForm) {
        createTicketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let tickets = [];
            try { 
                tickets = JSON.parse(localStorage.getItem('cj_tickets')) || []; 
            } catch { 
                tickets = []; 
            }

            const newTicket = {
                id: Date.now(),
                subject: document.getElementById('ticketSubject').value,
                userEmail: document.getElementById('ticketUserEmail').value,
                priority: document.getElementById('ticketPriority').value,
                description: document.getElementById('ticketDescription').value,
                status: 'Open',
                createdAt: new Date().toISOString(),
                updates: [{
                    date: new Date().toISOString(),
                    message: 'Ticket created.'
                }]
            };

            tickets.unshift(newTicket);
            localStorage.setItem('cj_tickets', JSON.stringify(tickets));
            
            showNotification('Support ticket created successfully.');
            ticketModal.style.display = 'none';
            createTicketForm.reset();
            renderTickets();
        });
    }
});

// Initialize tickets when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTickets();
});
