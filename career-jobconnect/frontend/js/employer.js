// employer.js - Dashboard and document management for Employer

// Document Viewer Component
class DocumentViewer {
    constructor() {
        this.modal = document.getElementById('documentViewerModal');
        this.iframe = document.getElementById('documentViewer');
        this.title = document.getElementById('documentViewerTitle');
        this.currentDoc = null;
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Close modal when clicking the close button or outside the content
        document.querySelector('.close-document-viewer')?.addEventListener('click', () => this.close());
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
        
        // Download button
        document.getElementById('downloadDocumentBtn')?.addEventListener('click', () => this.download());
    }
    
    open(doc) {
        if (!doc || !doc.content) return;
        
        this.currentDoc = doc;
        this.title.textContent = doc.name || 'Document Viewer';
        
        // Show PDF in iframe or download link for other types
        if (doc.type === 'application/pdf') {
            const dataUrl = `data:${doc.type};base64,${doc.content}`;
            this.iframe.src = dataUrl;
        } else {
            this.iframe.srcdoc = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${doc.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .unsupported-doc { text-align: center; margin-top: 50px; }
                        .download-btn {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background: #0077cc;
                            color: white;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                    </style>
                </head>
                <body>
                    <div class="unsupported-doc">
                        <h2>Document Preview Not Available</h2>
                        <p>This document type cannot be previewed in the browser.</p>
                        <a href="#" class="download-btn" id="downloadBtn">Download Document</a>
                    </div>
                    <script>
                        document.getElementById('downloadBtn').addEventListener('click', (e) => {
                            e.preventDefault();
                            window.parent.postMessage({ type: 'downloadDocument' }, '*');
                        });
                    </script>
                </body>
                </html>
            `;
        }
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.modal.style.display = 'none';
        this.iframe.src = '';
        this.currentDoc = null;
        document.body.style.overflow = '';
    }
    
    download() {
        if (!this.currentDoc) return;
        
        const link = document.createElement('a');
        link.href = `data:${this.currentDoc.type};base64,${this.currentDoc.content}`;
        link.download = this.currentDoc.name || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.dashboard-main section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            sections.forEach(sec => {
                sec.style.display = sec.id === targetId ? 'block' : 'none';
            });
            
            // Refresh applications list when showing applicants section
            if (targetId === 'applicants') {
                renderApplicationsTable('applicationsTableContainer');
            }
        });
    });
    
    // Show company profile section by default
    sections.forEach(sec => {
        sec.style.display = sec.id === 'company-profile' ? 'block' : 'none';
    });
    
    // Initialize document viewer
    window.docViewer = new DocumentViewer();
    
    // Listen for download messages from iframe
    window.addEventListener('message', (e) => {
        if (e.data.type === 'downloadDocument' && window.docViewer) {
            window.docViewer.download();
        }
    });
});

// Get shared documents for an applicant
function getApplicantDocuments(applicantEmail) {
    try {
        // In a real app, this would be fetched from the server
        const allDocs = JSON.parse(localStorage.getItem('jobseeker_documents') || '[]');
        return allDocs.filter(doc => doc.isShared);
    } catch (error) {
        console.error('Error fetching applicant documents:', error);
        return [];
    }
}

// Fetch all applications from localStorage
function getApplications() {
    try {
        return JSON.parse(localStorage.getItem('cj_applications') || '[]');
    } catch {
        return [];
    }
}

// Update application status and persist
function updateApplicationStatus(idx, status) {
    const apps = getApplications();
    if (apps[idx]) {
        apps[idx].status = status;
        localStorage.setItem('cj_applications', JSON.stringify(apps));
    }
}

// Render applications table with document viewing
function renderApplicationsTable(containerId) {
    const container = document.getElementById(containerId);
    const apps = getApplications();
    if (!container) return;
    
    if (!apps.length) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem 1rem; background:#f9f9f9; border-radius:8px;">
                <div style="font-size:4rem; margin-bottom:1rem;">📭</div>
                <h3 style="color:#555; margin-bottom:0.5rem;">No applications yet</h3>
                <p style="color:#888; max-width:500px; margin:0 auto 1.5rem;">
                    You haven't received any job applications yet. Check back later or share your job postings to attract more candidates.
                </p>
            </div>
        `;
        return;
    }
    container.innerHTML = `
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: #333; margin: 0;">Job Applications (${apps.length})</h3>
            <div style="display: flex; gap: 0.75rem;">
                <input type="text" id="applicantSearch" placeholder="Search applicants..." 
                       style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; min-width: 250px;" />
                <select id="statusFilter" 
                        style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; background: white; cursor: pointer;">
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
        </div>
        
        <div style="background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.05);">
            <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f7f9fc; color:#0077cc; font-weight:600;">
                            <th style="padding:1rem; text-align:left; min-width:180px;">Applicant</th>
                            <th style="padding:1rem; text-align:left; min-width:200px;">Job Details</th>
                            <th style="padding:1rem; text-align:left; width:120px;">Applied On</th>
                            <th style="padding:1rem; text-align:left; width:120px;">Status</th>
                                </tr>
                    </thead>
                    <tbody>
                        ${apps.map((app, idx) => {
                            const documents = getApplicantDocuments(app.jobseeker?.email || '');
                            const cvDoc = documents.find(doc => doc.isCV);
                            
                            return `
                                <tr style="border-bottom:1px solid #f0f0f0;" 
                                    data-status="${app.status || 'Pending'}"
                                    data-applicant="${(app.jobseeker?.name || '').toLowerCase()}">
                                    
                                    <!-- Applicant Column -->
                                    <td style="padding:1rem; vertical-align:top;">
                                        <div style="display:flex; align-items:center; gap:0.75rem;">
                                            <div style="width:40px; height:40px; border-radius:50%; background:#e3f2fd; 
                                                display:flex; align-items:center; justify-content:center; color:#0077cc; 
                                                font-weight:600; flex-shrink:0;">
                                                ${app.jobseeker?.name ? app.jobseeker.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div style="font-weight:600; color:#333;">
                                                    ${app.jobseeker?.name || 'N/A'}
                                                </div>
                                                <div style="font-size:0.9rem; color:#666; margin-top:2px;">
                                                    ${app.jobseeker?.email || ''}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <!-- Job Details Column -->
                                    <td style="padding:1rem; vertical-align:top;">
                                        <div style="font-weight:600; color:#333;">
                                            ${app.jobTitle || 'N/A'}
                                        </div>
                                        ${app.company ? `<div style="font-size:0.9rem; color:#666; margin-top:2px;">
                                            ${app.company}
                                        </div>` : ''}
                                        ${app.location ? `<div style="font-size:0.85rem; color:#888; margin-top:2px;">
                                            📍 ${app.location}
                                        </div>` : ''}
                                        
                                        <!-- Documents Section -->
                                        ${documents.length > 0 ? `
                                            <div style="margin-top:0.75rem;">
                                                <div style="font-size:0.85rem; font-weight:500; color:#555; margin-bottom:6px;">
                                                    Shared Documents:
                                                </div>
                                                <div style="display:flex; flex-direction:column; gap:0.25rem;">
                                                    ${documents.map(doc => `
                                                        <div onclick="viewDocument(${JSON.stringify(doc)})" 
                                                             style="cursor:pointer; display:flex; align-items:center; gap:0.5rem;
                                                                    padding:0.25rem 0.5rem; border-radius:4px;
                                                                    background:#f5f9ff; font-size:0.85rem;"
                                                             title="Click to view ${doc.name}">
                                                            <span>${doc.type.includes('pdf') ? '📄' : '📝'}</span>
                                                            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                                                ${doc.name}
                                                            </span>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                                                    <!-- Applied On Column -->
                                    <td style="padding:1rem; vertical-align:top; color:#555; font-size:0.9rem;">
                                        ${app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        }) : 'N/A'}
                                    </td>
                                    
                                    <!-- Status Column -->
                                    <td style="padding:1rem; vertical-align:top;">
                                        <span style="display:inline-flex; align-items:center; padding:0.25rem 0.75rem; 
                                            border-radius:12px; font-size:0.8rem; font-weight:500; 
                                            background:${app.status === 'Shortlisted' ? '#e8f5e9' : 
                                                        app.status === 'Rejected' ? '#ffebee' : '#e3f2fd'}; 
                                            color:${app.status === 'Shortlisted' ? '#2e7d32' : 
                                                    app.status === 'Rejected' ? '#c62828' : '#1565c0'}">
                                            ${app.status || 'Pending'}
                                        </span>
                                    </td>
                                    
                                    <!-- Actions Column -->
                                    <td style="padding:1rem; vertical-align:top; text-align:right;">
                                        <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                                            <button class="action-btn view-btn" data-idx="${idx}" 
                                                style="background:#f5f5f5; color:#333; border:1px solid #ddd; 
                                                    border-radius:6px; padding:0.5rem 1rem; font-size:0.85rem; 
                                                    cursor:pointer; display:flex; align-items:center; gap:0.5rem;"
                                                data-tooltip="View Application">
                                                👁️ View
                                            </button>
                                            
                                            <div style="position:relative;">
                                                <button class="action-menu-btn" 
                                                    style="background:white; border:1px solid #ddd; border-radius:6px; 
                                                        padding:0.5rem; cursor:pointer; display:flex; align-items:center; 
                                                        justify-content:center;"
                                                    data-tooltip="More actions">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                                        stroke-linejoin="round">
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="12" cy="5" r="1"></circle>
                                                        <circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </button>
                                                
                                                <div class="action-dropdown" 
                                                    style="display:none; position:absolute; right:0; top:100%; 
                                                        background:white; border:1px solid #eee; border-radius:8px; 
                                                        box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:10; 
                                                        min-width:180px; margin-top:4px;">
                                                    
                                                    <button class="dropdown-item shortlist-btn" data-idx="${idx}" 
                                                        style="width:100%; text-align:left; padding:0.75rem 1rem; 
                                                            background:none; border:none; cursor:pointer; font-size:0.9rem; 
                                                            color:#333; display:flex; align-items:center; gap:0.5rem;" 
                                                        ${app.status === 'Shortlisted' ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                                        <span>✅</span> Shortlist
                                                    </button>
                                                    
                                                    <button class="dropdown-item reject-btn" data-idx="${idx}" 
                                                        style="width:100%; text-align:left; padding:0.75rem 1rem; 
                                                            background:none; border:none; border-top:1px solid #f0f0f0; 
                                                            cursor:pointer; font-size:0.9rem; color:#d32f2f; 
                                                            display:flex; align-items:center; gap:0.5rem;" 
                                                        ${app.status === 'Rejected' ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                                                        <span>❌</span> Reject
                                                    </button>
                                                    
                                                    ${cvDoc ? `
                                                        <button class="dropdown-item download-cv-btn" 
                                                            data-doc='${JSON.stringify(cvDoc).replace(/'/g, '&apos;')}'
                                                            style="width:100%; text-align:left; padding:0.75rem 1rem; 
                                                                background:none; border:none; border-top:1px solid #f0f0f0; 
                                                                cursor:pointer; font-size:0.9rem; color:#0077cc; 
                                                                display:flex; align-items:center; gap:0.5rem;">
                                                            <span>📄</span> Download CV
                                                        </button>
                                                    ` : ''}
                                                    
                                                    <button class="dropdown-item message-btn" 
                                                        style="width:100%; text-align:left; padding:0.75rem 1rem; 
                                                            background:none; border:none; border-top:1px solid #f0f0f0; 
                                                            cursor:pointer; font-size:0.9rem; color:#555; 
                                                            display:flex; align-items:center; gap:0.5rem;">
                                                        <span>✉️</span> Send Message
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            ${apps.length > 10 ? `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; 
                            border-top:1px solid #f0f0f0; color:#666; font-size:0.9rem;">
                    <div>Showing 1-10 of ${apps.length} applications</div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="pagination-btn" disabled 
                            style="background:#f5f5f5; border:1px solid #ddd; border-radius:4px; 
                                   padding:0.4rem 0.8rem; cursor:not-allowed; color:#999;">
                            Previous
                        </button>
                        <button class="pagination-btn active" 
                            style="background:#0077cc; color:white; border:none; border-radius:4px; 
                                   padding:0.4rem 0.8rem; cursor:pointer;">
                            1
                        </button>
                        <button class="pagination-btn" 
                            style="background:white; border:1px solid #ddd; border-radius:4px; 
                                   padding:0.4rem 0.8rem; cursor:pointer;">
                            2
                        </button>
                        <button class="pagination-btn" 
                            style="background:white; border:1px solid #ddd; border-radius:4px; 
                                   padding:0.4rem 0.8rem; cursor:pointer;">
                            Next
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    // Add event listeners after rendering
    setTimeout(() => {
        setupEventListeners(container);
    }, 100);
}

// View document in the document viewer
function viewDocument(doc) {
    if (window.docViewer) {
        // If content is a URL, we'd typically fetch it first
        // For now, we'll just open it directly if it's a URL
        if (doc.content && doc.content.startsWith('http')) {
            window.open(doc.content, '_blank');
        } else if (doc.content) {
            // If it's base64 content, open in our viewer
            window.docViewer.open({
                name: doc.name,
                type: doc.type,
                content: doc.content
            });
        }
    }
}

// Setup event listeners for the applications table
function setupEventListeners(container) {
    // View application details
    container.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const apps = getApplications();
            if (isNaN(idx) || !apps[idx]) return;
            
            // In a real app, this would show a detailed view
            const app = apps[idx];
            alert(`Viewing application from: ${app.jobseeker?.name || 'Unknown'}`);
        });
    });
    
    // Action menu toggle
    container.querySelectorAll('.action-menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            const isVisible = dropdown.style.display === 'block';
            
            // Close all other dropdowns
            document.querySelectorAll('.action-dropdown').forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });
            
            // Toggle current dropdown
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.action-menu-btn') && !e.target.closest('.action-dropdown')) {
            document.querySelectorAll('.action-dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
    
    // Shortlist application
    container.querySelectorAll('.shortlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const idx = parseInt(this.getAttribute('data-idx'));
            if (isNaN(idx)) return;
            
            updateApplicationStatus(idx, 'Shortlisted');
            renderApplicationsTable(container.id);
            showNotification('✅ Application shortlisted!');
        });
    });
    
    // Reject application
    container.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const idx = parseInt(this.getAttribute('data-idx'));
            if (isNaN(idx)) return;
            
            if (confirm('Are you sure you want to reject this application?')) {
                updateApplicationStatus(idx, 'Rejected');
                renderApplicationsTable(container.id);
                showNotification('❌ Application rejected.');
            }
        });
    });
    
    // Download CV
    container.querySelectorAll('.download-cv-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            try {
                const doc = JSON.parse(this.getAttribute('data-doc'));
                if (doc.content) {
                    const link = document.createElement('a');
                    link.href = `data:${doc.type};base64,${doc.content}`;
                    link.download = doc.name || 'document';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showNotification('📄 Download started...');
                }
            } catch (error) {
                console.error('Error downloading document:', error);
                showNotification('❌ Error downloading document', 'error');
            }
        });
    });
    
    // Search functionality
    const searchInput = container.querySelector('#applicantSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = container.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const name = row.getAttribute('data-applicant') || '';
                const email = row.querySelector('td:first-child div:nth-child(2)')?.textContent?.toLowerCase() || '';
                const jobTitle = row.querySelector('td:nth-child(2) > div:first-child')?.textContent?.toLowerCase() || '';
                
                if (name.includes(searchTerm) || email.includes(searchTerm) || jobTitle.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Status filter
    const statusFilter = container.querySelector('#statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const status = this.value;
            const rows = container.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const rowStatus = row.getAttribute('data-status');
                if (!status || rowStatus === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize tooltips
    initTooltips();
}

// Show a notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + (this.offsetWidth / 2) - (tooltip.offsetWidth / 2)) + 'px';
    
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        document.body.removeChild(this._tooltip);
        this._tooltip = null;
    }
}
