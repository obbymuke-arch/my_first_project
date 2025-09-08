// analytics.js - Employer dashboard analytics (demo)
// Uses Chart.js for visualization (CDN loaded in dashboard)

document.addEventListener('DOMContentLoaded', function() {
    // Applications per job (bar chart)
    let apps = [];
    try { apps = JSON.parse(localStorage.getItem('cj_applications') || '[]'); } catch { apps = []; }
    const jobCounts = {};
    const statusCounts = { Accepted: 0, Rejected: 0, Pending: 0 };
    apps.forEach(app => {
        if (!jobCounts[app.jobTitle]) jobCounts[app.jobTitle] = 0;
        jobCounts[app.jobTitle]++;
        if (app.status === 'Accepted') statusCounts.Accepted++;
        else if (app.status === 'Rejected') statusCounts.Rejected++;
        else statusCounts.Pending++;
    });
    // Bar chart
    const labels = Object.keys(jobCounts);
    const data = Object.values(jobCounts);
    if (labels.length && document.getElementById('analyticsChart')) {
        new Chart(document.getElementById('analyticsChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Applications per Job',
                    data: data,
                    backgroundColor: '#0077cc',
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
    // Pie chart for status
    if (document.getElementById('statusPieChart')) {
        new Chart(document.getElementById('statusPieChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Accepted', 'Rejected', 'Pending'],
                datasets: [{
                    data: [statusCounts.Accepted, statusCounts.Rejected, statusCounts.Pending],
                    backgroundColor: ['#43a047', '#d32f2f', '#0077cc'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
});
