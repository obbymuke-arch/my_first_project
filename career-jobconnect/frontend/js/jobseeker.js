// jobseeker.js - Dashboard navigation logic for Job Seeker

document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.dashboard-main section');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            sections.forEach(sec => {
                sec.style.display = sec.id === targetId ? 'block' : 'none';
            });
        });
    });
    // Show profile section by default
    sections.forEach(sec => {
        sec.style.display = sec.id === 'profile' ? 'block' : 'none';
    });
});
