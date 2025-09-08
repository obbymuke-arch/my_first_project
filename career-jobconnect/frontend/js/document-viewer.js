// Document Viewer for Employer Dashboard
class DocumentViewer {
    constructor() {
        this.currentDocument = null;
        this.docViewerModal = document.getElementById('documentViewerModal');
        this.docViewerIframe = document.getElementById('documentViewer');
        this.docViewerTitle = document.getElementById('documentViewerTitle');
        this.downloadBtn = document.getElementById('downloadDocumentBtn');
        this.printBtn = document.getElementById('printDocumentBtn');
        this.closeBtn = document.querySelector('.close-document-viewer');
        
        this.initEventListeners();
    }

    // Initialize event listeners
    initEventListeners() {
        // Close modal when clicking the close button
        this.closeBtn?.addEventListener('click', () => this.close());
        
        // Close modal when clicking outside the content
        this.docViewerModal?.addEventListener('click', (e) => {
            if (e.target === this.docViewerModal) {
                this.close();
            }
        });
        
        // Download button
        this.downloadBtn?.addEventListener('click', () => this.downloadCurrentDocument());
        
        // Print button
        this.printBtn?.addEventListener('click', () => this.printCurrentDocument());
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.docViewerModal.style.display === 'flex') {
                this.close();
            }
        });
    }
    
    // Open the document viewer with a specific document
    open(documentData) {
        if (!documentData || !documentData.content) return;
        
        this.currentDocument = documentData;
        this.docViewerTitle.textContent = documentData.name || 'Document Viewer';
        
        // Create a data URL for the document
        const dataUrl = `data:${documentData.type};base64,${documentData.content}`;
        
        // Set the iframe source to the data URL
        this.docViewerIframe.src = dataUrl;
        
        // Show the modal
        this.docViewerModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close the document viewer
    close() {
        this.docViewerModal.style.display = 'none';
        this.docViewerIframe.src = '';
        this.currentDocument = null;
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Download the current document
    downloadCurrentDocument() {
        if (!this.currentDocument) return;
        
        const link = document.createElement('a');
        link.href = `data:${this.currentDocument.type};base64,${this.currentDocument.content}`;
        link.download = this.currentDocument.name || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Print the current document
    printCurrentDocument() {
        if (!this.currentDocument) return;
        
        const printWindow = window.open('', '_blank');
        const doc = printWindow.document;
        
        // Create a simple HTML document for printing
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${this.currentDocument.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .document-info { margin-bottom: 20px; font-size: 14px; color: #666; }
                    .document-info span { display: inline-block; margin-right: 15px; }
                    @media print {
                        .no-print { display: none; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h1>${this.currentDocument.name}</h1>
                <div class="document-info">
                    <span><strong>Type:</strong> ${this.getFileType(this.currentDocument.type)}</span>
                    <span><strong>Size:</strong> ${this.formatFileSize(this.currentDocument.size)}</span>
                    <span><strong>Date:</strong> ${new Date(this.currentDocument.uploadedAt).toLocaleDateString()}</span>
                </div>
                <div>
                    <iframe src="data:${this.currentDocument.type};base64,${this.currentDocument.content}" 
                            style="width: 100%; height: 90vh; border: none;"></iframe>
                </div>
                <div class="no-print" style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                    Printed from CareerJobConnect on ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `);
        
        doc.close();
        
        // Wait for the iframe to load before printing
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    }
    
    // Get file type from MIME type
    getFileType(mimeType) {
        const types = {
            'application/pdf': 'PDF Document',
            'application/msword': 'Microsoft Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (DOCX)'
        };
        return types[mimeType] || 'Document';
    }
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the document viewer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on the employer dashboard
    if (document.querySelector('body').classList.contains('employer-dashboard') || 
        window.location.pathname.includes('dashboard-employer')) {
        const docViewer = new DocumentViewer();
        window.docViewer = docViewer; // Make it globally available
        
        // Add event delegation for document items
        document.addEventListener('click', (e) => {
            const documentItem = e.target.closest('.document-item');
            if (documentItem) {
                e.preventDefault();
                const documentId = documentItem.dataset.docId;
                const documentData = JSON.parse(documentItem.dataset.docInfo);
                docViewer.open(documentData);
            }
        });
    }
});
