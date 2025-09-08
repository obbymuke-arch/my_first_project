// job-list-demo.js - Render sample job listings in jobseeker dashboard

document.addEventListener('DOMContentLoaded', function() {
    const jobListDemo = document.getElementById('job-list-demo');
    if (!jobListDemo) return;
    // Sample jobs (would be fetched from backend or JSON in real app)
    const jobs = [
        {
            title: 'Frontend Developer',
            company: 'Tech Solutions',
            location: 'Remote',
            category: 'Engineering',
            salary: 90000,
            description: 'Build modern web interfaces using HTML, CSS, and JavaScript.',
            deadline: '2025-09-30'
        },
        {
            title: 'UI/UX Designer',
            company: 'Creative Minds',
            location: 'San Francisco, CA',
            category: 'Design',
            salary: 85000,
            description: 'Design user-centric interfaces and experiences.',
            deadline: '2025-10-10'
        },
        {
            title: 'Product Manager',
            company: 'Visionary Inc.',
            location: 'Remote',
            category: 'Product',
            salary: 120000,
            description: 'Lead product development and strategy.',
            deadline: '2025-09-25'
        }
    ];
    jobListDemo.innerHTML = jobs.map(job => `
        <div class="job-item" style="margin-bottom:1.5rem;">
            <h3>${job.title}</h3>
            <p><strong>${job.company}</strong> &mdash; ${job.location} | ${job.category} | <span style="color:#0077cc;">$${job.salary}</span></p>
            <p>${job.description}</p>
            <p><small>Deadline: ${job.deadline}</small></p>
            <button class="apply-btn">Apply</button>
        </div>
    `).join('');
    // Demo: Apply button
    jobListDemo.addEventListener('click', function(e) {
        if (e.target.classList.contains('apply-btn')) {
            alert('Application submitted! (Demo)');
        }
    });
});
