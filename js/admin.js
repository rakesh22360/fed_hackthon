// ===================================
// Admin Dashboard - JS
// =================================== 

/**
 * Initialize Admin Dashboard
 */
function initializeAdminDashboard() {
    try {
        console.log('Initializing Admin Dashboard...');
        loadMockData().then(data => {
            displayAdminStats(data);
            displayPollingStationsTable(data);
            loadAdminConfiguration();
        });
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        showNotification('Error loading dashboard', 'danger');
    }
}

/**
 * Display admin statistics
 * @param {Object} data - Mock election data
 */
function displayAdminStats(data) {
    try {
        const totalStations = data.pollingStations?.length || 0;
        const totalVoters = data.election?.totalVoters || 0;
        const activeIssuesCount = getActiveIssuesCount();
        
        document.getElementById('total-stations').textContent = totalStations;
        document.getElementById('total-voters').textContent = totalVoters.toLocaleString();
        document.getElementById('active-issues').textContent = activeIssuesCount;
        document.getElementById('system-status').textContent = activeIssuesCount === 0 ? 'Operational' : 'Attention Required';
    } catch (error) {
        console.error('Error displaying admin stats:', error);
    }
}

/**
 * Display polling stations in table
 * @param {Object} data - Mock election data
 */
function displayPollingStationsTable(data) {
    try {
        const tbody = document.getElementById('stations-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (!data.pollingStations || data.pollingStations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No polling stations found</td></tr>';
            return;
        }
        
        data.pollingStations.forEach(station => {
            const row = document.createElement('tr');
            const occupancyPercent = station.capacity > 0 
                ? Math.round((station.currentVoters / station.capacity) * 100) 
                : 0;
            
            row.innerHTML = `
                <td>${station.id}</td>
                <td>${station.location}</td>
                <td>${station.capacity}</td>
                <td>${station.currentVoters}</td>
                <td>${getStatusBadge(station.status)}</td>
            `;
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying polling stations table:', error);
    }
}

/**
 * Load admin configuration from localStorage or use defaults
 */
function loadAdminConfiguration() {
    try {
        const config = loadFromLocalStorage('admin_config') || {
            electionName: 'General Election 2025',
            electionDate: '2025-12-15',
            electionStatus: 'Planning',
            timeLimit: 12
        };
        
        document.getElementById('election-name').value = config.electionName || '';
        document.getElementById('election-date').value = config.electionDate || '';
        document.getElementById('election-status').value = config.electionStatus || 'Planning';
        document.getElementById('time-limit').value = config.timeLimit || '';
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

/**
 * Save admin configuration to localStorage
 */
function adminSaveConfiguration() {
    try {
        const config = {
            electionName: document.getElementById('election-name').value,
            electionDate: document.getElementById('election-date').value,
            electionStatus: document.getElementById('election-status').value,
            timeLimit: document.getElementById('time-limit').value
        };
        
        // Validate required fields
        if (!config.electionName || !config.electionDate) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        saveToLocalStorage('admin_config', config);
        showNotification('Configuration saved successfully', 'success');
    } catch (error) {
        console.error('Error saving configuration:', error);
        showNotification('Error saving configuration', 'danger');
    }
}

/**
 * Refresh admin dashboard data
 */
function adminRefreshData() {
    try {
        initializeAdminDashboard();
        showNotification('Dashboard refreshed', 'success', 2000);
    } catch (error) {
        console.error('Error refreshing data:', error);
        showNotification('Error refreshing data', 'danger');
    }
}

/**
 * Get admin statistics summary
 * @returns {Object} Statistics object
 */
function getAdminStats() {
    try {
        const config = loadFromLocalStorage('admin_config');
        const issues = loadFromLocalStorage('citizen_issues') || [];
        
        return {
            config: config,
            activeIssues: issues.filter(issue => issue.status === 'open').length,
            totalIssues: issues.length,
            lastUpdated: new Date().toLocaleString()
        };
    } catch (error) {
        console.error('Error getting admin stats:', error);
        return null;
    }
}

/**
 * Export admin report
 */
function adminExportReport() {
    try {
        const stats = getAdminStats();
        const data = loadFromLocalStorage('admin_config');
        
        const report = `
Election Monitoring System - Admin Report
Generated: ${new Date().toLocaleString()}

Election Configuration:
- Name: ${data?.electionName || 'N/A'}
- Date: ${data?.electionDate || 'N/A'}
- Status: ${data?.electionStatus || 'N/A'}
- Duration: ${data?.timeLimit || 'N/A'} hours

Statistics:
- Total Issues: ${stats?.totalIssues || 0}
- Active Issues: ${stats?.activeIssues || 0}
- Last Updated: ${stats?.lastUpdated || 'N/A'}
        `;
        
        downloadCSV(report, 'admin-report.txt');
        showNotification('Report exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report', 'danger');
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdminDashboard);
} else {
    initializeAdminDashboard();
}
