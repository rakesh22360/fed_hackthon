// ===================================
// Citizen Dashboard - JS
// =================================== 

/**
 * Initialize Citizen Dashboard
 */
function initializeCitizenDashboard() {
    try {
        console.log('Initializing Citizen Dashboard...');
        loadMockData().then(data => {
            displayCitizenStats(data);
            setupIssueReportForm();
            displayCitizenReports();
            displayElectionInfo(data);
        });
    } catch (error) {
        console.error('Error initializing citizen dashboard:', error);
        showNotification('Error loading dashboard', 'danger');
    }
}

/**
 * Display citizen statistics
 * @param {Object} data - Mock election data
 */
function displayCitizenStats(data) {
    try {
        const userIssues = getUserIssues();
        const nearestStation = data.pollingStations?.[0] || {};
        
        document.getElementById('my-reports-count').textContent = userIssues.length;
        document.getElementById('nearest-station').textContent = nearestStation.location || 'Not available';
        document.getElementById('citizen-election-status').textContent = data.election?.status || 'Upcoming';
        document.getElementById('support-hotline').textContent = '1-800-VOTE';
    } catch (error) {
        console.error('Error displaying citizen stats:', error);
    }
}

/**
 * Setup issue report form
 */
function setupIssueReportForm() {
    try {
        const form = document.getElementById('issue-report-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitIssueReport();
        });
    } catch (error) {
        console.error('Error setting up form:', error);
    }
}

/**
 * Submit citizen issue report
 */
function submitIssueReport() {
    try {
        const user = getCurrentUser();
        const formData = {
            id: generateId(),
            title: document.getElementById('report-title').value,
            category: document.getElementById('report-category').value,
            severity: document.getElementById('report-severity').value,
            station: document.getElementById('report-station').value,
            description: document.getElementById('report-description').value,
            anonymous: document.getElementById('report-anonymous').checked,
            timestamp: new Date().toISOString(),
            status: 'open',
            userEmail: user.email
        };
        
        // Validate required fields
        if (!formData.title || !formData.category || !formData.severity || !formData.station || !formData.description) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        // Add issue using storage module
        addIssue(formData);
        
        // Show success message
        document.getElementById('success-message').style.display = 'block';
        
        // Reset form
        document.getElementById('issue-report-form').reset();
        
        // Refresh reports display
        displayCitizenReports();
        loadMockData().then(data => displayCitizenStats(data));
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            document.getElementById('success-message').style.display = 'none';
        }, 5000);
        
        showNotification('Your report has been submitted successfully!', 'success');
    } catch (error) {
        console.error('Error submitting report:', error);
        showNotification('Error submitting report', 'danger');
    }
}

/**
 * Display citizen's submitted reports
 */
function displayCitizenReports() {
    try {
        const reportsList = document.getElementById('reports-list');
        if (!reportsList) return;
        
        const reports = getUserIssues();
        
        if (reports.length === 0) {
            reportsList.innerHTML = '<p style="text-align: center; color: #64748b;">No reports submitted yet</p>';
            return;
        }
        
        // Sort by timestamp descending
        reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        reportsList.innerHTML = reports.map(report => `
            <div class="report-card">
                <div class="report-title">${escapeHtml(report.title)}</div>
                <div class="report-meta">
                    <strong>Station:</strong> ${escapeHtml(report.station)}<br>
                    <strong>Submitted:</strong> ${new Date(report.timestamp).toLocaleString()}<br>
                    <strong>Category:</strong> ${escapeHtml(report.category)}
                </div>
                <div class="report-description">${escapeHtml(report.description)}</div>
                <div style="margin-top: 10px;">
                    <span class="report-severity ${report.severity}">${report.severity.toUpperCase()}</span>
                    ${report.anonymous ? '<span style="margin-left: 10px; color: #64748b; font-size: 12px;">Anonymous</span>' : ''}
                </div>
                <button class="btn btn-secondary" style="margin-top: 10px; padding: 6px 12px; font-size: 12px;" onclick="deleteReport('${report.id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying reports:', error);
    }
}

/**
 * Delete a citizen report
 * @param {string} reportId - ID of report to delete
 */
function deleteReport(reportId) {
    try {
        if (!confirm('Are you sure you want to delete this report?')) return;
        deleteIssue(reportId);
        displayCitizenReports();
        showNotification('Report deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting report:', error);
        showNotification('Error deleting report', 'danger');
    }
}

/**
 * Display election information
 * @param {Object} data - Mock election data
 */
function displayElectionInfo(data) {
    try {
        const election = data.election || {};
        
        document.getElementById('citizen-election-date').textContent = 
            formatDate(election.date) || '-';
        document.getElementById('polling-hours').textContent = 
            election.pollingHours || '-';
        document.getElementById('required-docs').textContent = 
            election.requiredDocuments || '-';
        document.getElementById('find-station-info').textContent = 
            'Visit the information desk or contact support hotline 1-800-VOTE';
    } catch (error) {
        console.error('Error displaying election info:', error);
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtmlLocal(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Export citizen reports
 */
function citizenExportReports() {
    try {
        const reports = loadFromLocalStorage('citizen_issues') || [];
        
        if (reports.length === 0) {
            showNotification('No reports to export', 'warning');
            return;
        }
        
        const csv = convertToCSV(reports.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            severity: r.severity,
            station: r.station,
            date: r.timestamp,
            status: r.status
        })));
        
        downloadCSV(csv, 'my-reports.csv');
        showNotification('Reports exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting reports:', error);
        showNotification('Error exporting reports', 'danger');
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCitizenDashboard);
} else {
    initializeCitizenDashboard();
}
