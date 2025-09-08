// Document Manager for Job Seeker Dashboard
class DocumentManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        this.documents = this.loadDocuments();
        this.initEventListeners();
        this.renderDocuments();
    }

    // Load documents from localStorage
    loadDocuments() {
        try {
            return JSON.parse(localStorage.getItem('jobseeker_documents') || '[]');
        } catch (e) {
            console.error('Error loading documents:', e);
            return [];
        }
    }

    // Save documents to localStorage
    saveDocuments() {
        localStorage.setItem('jobseeker_documents', JSON.stringify(this.documents));
    }

    // Initialize event listeners
    initEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('documentUpload');
        const browseLink = document.getElementById('browseFiles');
        const shareWithEmployers = document.getElementById('shareWithEmployers');

        // Handle file selection via browse
        browseLink?.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput?.click();
        });

        // Handle file input change
        fileInput?.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
            fileInput.value = ''; // Reset input to allow re-uploading the same file
        });

        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone?.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone?.addEventListener(eventName, () => {
                dropZone.style.borderColor = '#005fa3';
                dropZone.style.backgroundColor = '#f0f8ff';
            }, false);
        });

        // Remove highlight when item leaves drop zone
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone?.addEventListener(eventName, () => {
                dropZone.style.borderColor = '#0077cc';
                dropZone.style.backgroundColor = '';
            }, false);
        });

        // Handle dropped files
        dropZone?.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFileSelect(files);
        }, false);

        // Handle share with employers toggle
        shareWithEmployers?.addEventListener('change', (e) => {
            const share = e.target.checked;
            // Update the sharing preference in localStorage
            localStorage.setItem('share_cv_with_employers', share);
            this.renderDocuments();
        });
    }

    // Prevent default drag and drop behavior
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Handle file selection
    async handleFileSelect(files) {
        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file type
            if (!this.allowedTypes.includes(file.type)) {
                this.showNotification(`❌ Unsupported file type: ${file.name}. Please upload PDF or Word documents.`, 'error');
                continue;
            }

            // Validate file size
            if (file.size > this.maxFileSize) {
                this.showNotification(`❌ File too large: ${file.name}. Maximum size is 5MB.`, 'error');
                continue;
            }

            // Read file as base64
            try {
                const base64Content = await this.readFileAsBase64(file);
                const document = {
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString(),
                    content: base64Content,
                    isCV: file.name.toLowerCase().includes('cv') || file.name.toLowerCase().includes('resume'),
                    isShared: false
                };

                // Add to documents array
                this.documents.push(document);
                this.saveDocuments();
                this.showNotification(`✅ ${file.name} uploaded successfully!`);
                this.renderDocuments();
            } catch (error) {
                console.error('Error reading file:', error);
                this.showNotification(`❌ Error uploading ${file.name}. Please try again.`, 'error');
            }
        }
    }

    // Read file as base64
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Toggle document sharing
    toggleDocumentShare(docId) {
        const docIndex = this.documents.findIndex(doc => doc.id === docId);
        if (docIndex !== -1) {
            this.documents[docIndex].isShared = !this.documents[docIndex].isShared;
            this.saveDocuments();
            this.renderDocuments();
            this.showNotification(`Document sharing ${this.documents[docIndex].isShared ? 'enabled' : 'disabled'}`);
        }
    }

    // Delete a document
    deleteDocument(docId) {
        if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            const docIndex = this.documents.findIndex(doc => doc.id === docId);
            if (docIndex !== -1) {
                const docName = this.documents[docIndex].name;
                this.documents.splice(docIndex, 1);
                this.saveDocuments();
                this.renderDocuments();
                this.showNotification(`🗑️ ${docName} has been deleted.`);
            }
        }
    }

    // Download a document
    downloadDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        const link = document.createElement('a');
        link.href = `data:${doc.type};base64,${doc.content}`;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Render documents in the UI
    renderDocuments() {
        const uploadedContainer = document.getElementById('uploadedDocuments');
        const shareableContainer = document.getElementById('shareableDocuments');
        const shareWithEmployers = document.getElementById('shareWithEmployers');

        if (!uploadedContainer) return;

        // Set the share with employers toggle state
        if (shareWithEmployers) {
            shareWithEmployers.checked = localStorage.getItem('share_cv_with_employers') !== 'false';
        }

        // Group documents by type
        const cvDocuments = this.documents.filter(doc => doc.isCV);
        const otherDocuments = this.documents.filter(doc => !doc.isCV);

        // Render CVs
        const cvHTML = cvDocuments.map(doc => this.createDocumentCard(doc)).join('');
        
        // Render other documents
        const otherDocsHTML = otherDocuments.map(doc => this.createDocumentCard(doc)).join('');
        
        // Update the DOM
        uploadedContainer.innerHTML = cvHTML + otherDocsHTML || '<p>No documents uploaded yet.</p>';

        // Render shareable documents (non-CV)
        if (shareableContainer) {
            const shareableHTML = otherDocuments.map(doc => this.createShareableDocumentCard(doc)).join('');
            shareableContainer.innerHTML = shareableHTML || '<p>No additional documents available for sharing.</p>';
        }

        // Add event listeners to the new elements
        this.documents.forEach(doc => {
            const shareToggle = document.getElementById(`share-toggle-${doc.id}`);
            const downloadBtn = document.getElementById(`download-${doc.id}`);
            const deleteBtn = document.getElementById(`delete-${doc.id}`);

            if (shareToggle) {
                shareToggle.addEventListener('change', () => this.toggleDocumentShare(doc.id));
            }
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => this.downloadDocument(doc.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteDocument(doc.id));
            }
        });
    }

    // Create HTML for a document card
    createDocumentCard(doc) {
        const fileSize = this.formatFileSize(doc.size);
        const fileType = this.getFileTypeIcon(doc.type);
        
        return `
            <div class="document-card">
                <div class="document-icon">${fileType.icon}</div>
                <div class="document-info">
                    <div class="document-name" title="${doc.name}">${doc.name}</div>
                    <div class="document-meta">
                        <span>${fileType.name}</span>
                        <span>${fileSize}</span>
                    </div>
                </div>
                <div class="document-actions">
                    <button id="download-${doc.id}" title="Download">⬇️</button>
                    <button id="delete-${doc.id}" title="Delete">🗑️</button>
                </div>
            </div>
        `;
    }

    // Create HTML for a shareable document card
    createShareableDocumentCard(doc) {
        const fileType = this.getFileTypeIcon(doc.type);
        
        return `
            <div class="document-card">
                <div class="document-icon">${fileType.icon}</div>
                <div class="document-info">
                    <div class="document-name" title="${doc.name}">${doc.name}</div>
                    <div class="document-meta">
                        <span>${fileType.name}</span>
                        <label class="share-toggle" title="Share with employers">
                            <input type="checkbox" id="share-toggle-${doc.id}" ${doc.isShared ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Get file type icon and name
    getFileTypeIcon(mimeType) {
        const types = {
            'application/pdf': { icon: '📄', name: 'PDF' },
            'application/msword': { icon: '📝', name: 'DOC' },
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: '📝', name: 'DOCX' }
        };
        return types[mimeType] || { icon: '📄', name: 'File' };
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notificationBar = document.getElementById('notificationBar');
        const notificationMsg = document.getElementById('notificationMsg');
        
        if (notificationBar && notificationMsg) {
            notificationBar.style.display = 'block';
            notificationBar.style.background = type === 'error' ? '#d32f2f' : '#0077cc';
            notificationMsg.textContent = message;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                notificationBar.style.display = 'none';
            }, 5000);
        } else {
            alert(message);
        }
    }
}

// Initialize the document manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on the job seeker dashboard
    if (document.querySelector('body').classList.contains('jobseeker-dashboard') || 
        window.location.pathname.includes('dashboard-jobseeker')) {
        const docManager = new DocumentManager();
        window.docManager = docManager; // Make it globally available if needed
    }
});
