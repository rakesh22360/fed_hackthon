// ===================================
// Data Analyst Dashboard - JS
// =================================== 

/**
 * Initialize Data Analyst Dashboard
 */
function initializeAnalystDashboard() {
    try {
        console.log('Initializing Analyst Dashboard...');
        loadMockData().then(data => {
            displayAnalystStats(data);
            displayAnalyticsTable(data);
            displayInsights(data);
            setupReportForm();
            populateStationFilter(data);
        });
    } catch (error) {
        console.error('Error initializing analyst dashboard:', error);
        showNotification('Error loading dashboard', 'danger');
    }
}

/**
 * Display analyst statistics
 * @param {Object} data - Mock election data
 */
function displayAnalystStats(data) {
    try {
        const issues = getAllIssues();
        const totalVotes = Math.floor(Math.random() * 50000) + 10000; // Mock data
        const avgVotingTime = Math.floor(Math.random() * 15) + 3;
        const turnoutRate = Math.floor((totalVotes / (data.election?.totalVoters || 50000)) * 100);
        const anomalies = issues.filter(i => i.severity === 'high').length;
        
        document.getElementById('total-votes').textContent = totalVotes.toLocaleString();
        document.getElementById('avg-voting-time').textContent = avgVotingTime + ' mins';
        document.getElementById('turnout-rate').textContent = Math.min(100, turnoutRate) + '%';
        document.getElementById('anomalies').textContent = anomalies;
    } catch (error) {
        console.error('Error displaying analyst stats:', error);
    }
}

/**
 * Display analytics table
 * @param {Object} data - Mock election data
 */
function displayAnalyticsTable(data) {
    try {
        const tbody = document.getElementById('analytics-table-body');
        if (!tbody) return;
        
        const pollingStations = data.pollingStations || [];
        const issues = getAllIssues();
        
        if (pollingStations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No data available</td></tr>';
            return;
        }
        
        tbody.innerHTML = pollingStations.map(station => {
            const stationIssues = issues.filter(i => i.station.toLowerCase().includes(station.id.toLowerCase() || station.name.toLowerCase()));
            const totalVoters = station.capacity;
            const votesCounted = Math.floor(Math.random() * (station.capacity * 0.8)) + Math.floor(station.capacity * 0.2);
            const turnout = Math.round((votesCounted / totalVoters) * 100);
            const avgTime = Math.floor(Math.random() * 12) + 3;
            
            return `
                <tr>
                    <td>${station.id}</td>
                    <td>${totalVoters}</td>
                    <td>${votesCounted}</td>
                    <td>${turnout}%</td>
                    <td>${avgTime}</td>
                    <td>${stationIssues.length}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying analytics table:', error);
    }
}

/**
 * Display key insights and anomalies
 * @param {Object} data - Mock election data
 */
function displayInsights(data) {
    try {
        const container = document.getElementById('insights-container');
        if (!container) return;
        
        const issues = getAllIssues();
        const observations = getAllObservations();
        
        const insights = [
            {
                title: 'Highest Issue Categories',
                content: `Most reported issues: ${getTopIssueCategory(issues)}`,
                warning: false
            },
            {
                title: 'Critical Alerts',
                content: `${issues.filter(i => i.severity === 'high').length} high-severity issues detected`,
                warning: issues.filter(i => i.severity === 'high').length > 0
            },
            {
                title: 'Observer Compliance',
                content: `${observations.length} observations logged from field observers`,
                warning: false
            },
            {
                title: 'System Health',
                content: 'All systems operational and monitoring actively',
                warning: false
            }
        ];
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.warning ? 'warning' : ''}">
                <h4>${insight.title}</h4>
                <p>${insight.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying insights:', error);
    }
}

/**
 * Get top issue category
 * @param {Array} issues - Array of issues
 * @returns {string} Top category
 */
function getTopIssueCategory(issues) {
    if (issues.length === 0) return 'None';
    
    const categories = {};
    issues.forEach(issue => {
        categories[issue.category] = (categories[issue.category] || 0) + 1;
    });
    
    return Object.entries(categories)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various';
}

/**
 * Setup report form
 */
function setupReportForm() {
    try {
        const form = document.getElementById('report-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            generateCustomReport();
        });
    } catch (error) {
        console.error('Error setting up report form:', error);
    }
}

/**
 * Generate custom report
 */
function generateCustomReport() {
    try {
        const reportName = document.getElementById('report-name').value;
        const reportType = document.getElementById('report-type').value;
        const includeRecommendations = document.getElementById('include-recommendations').checked;
        
        if (!reportName || !reportType) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        const report = {
            id: generateId(),
            name: reportName,
            type: reportType,
            includeRecommendations: includeRecommendations,
            generatedDate: new Date().toLocaleString(),
            status: 'ready'
        };
        
        // Save report
        const reports = loadFromLocalStorage('analyst_reports') || [];
        reports.push(report);
        saveToLocalStorage('analyst_reports', reports);
        
        // Reset form
        document.getElementById('report-form').reset();
        
        showNotification(`Report "${reportName}" generated successfully!`, 'success');
    } catch (error) {
        console.error('Error generating report:', error);
        showNotification('Error generating report', 'danger');
    }
}

/**
 * Populate station filter dropdown
 * @param {Object} data - Mock election data
 */
function populateStationFilter(data) {
    try {
        const select = document.getElementById('analysis-station');
        if (!select || !data.pollingStations) return;
        
        data.pollingStations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = `${station.id} - ${station.location}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating station filter:', error);
    }
}

/**
 * Apply data filters
 */
function analystFilterData() {
    try {
        const fromDate = document.getElementById('analysis-date-from').value;
        const toDate = document.getElementById('analysis-date-to').value;
        const station = document.getElementById('analysis-station').value;
        
        if (!fromDate || !toDate) {
            showNotification('Please select both date range', 'warning');
            return;
        }
        
        if (new Date(fromDate) > new Date(toDate)) {
            showNotification('From date cannot be after To date', 'warning');
            return;
        }
        
        showNotification('Filters applied successfully', 'success', 2000);
        // In a real app, would filter data and redisplay tables
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error applying filters', 'danger');
    }
}

/**
 * Export analytics report
 */
function analystExportReport() {
    try {
        const issues = loadFromLocalStorage('citizen_issues') || [];
        const observations = loadFromLocalStorage('observer_observations') || [];
        
        loadMockData().then(data => {
            const pollingStations = data.pollingStations || [];
            
            // Create analytics data
            const analyticsData = pollingStations.map(station => ({
            'Station ID': station.id,
            'Location': station.location,
            'Total Voters': station.capacity,
            'Issues Reported': issues.filter(i => 
                i.station.toLowerCase().includes(station.name.toLowerCase())
            ).length,
            'Observations': observations.filter(o =>
                o.station.toLowerCase().includes(station.name.toLowerCase())
            ).length
        }));
        
            const csv = convertToCSV(analyticsData);
            downloadCSV(csv, 'election-analytics-report.csv');
            showNotification('Report exported successfully', 'success');
        });
    } catch (error) {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report', 'danger');
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnalystDashboard);
} else {
    initializeAnalystDashboard();
}
