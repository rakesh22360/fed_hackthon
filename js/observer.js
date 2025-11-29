// ===================================
// Election Observer Dashboard - JS
// =================================== 

/**
 * Initialize Election Observer Dashboard
 */
function initializeObserverDashboard() {
    try {
        console.log('Initializing Observer Dashboard...');
        loadMockData().then(data => {
            displayObserverStats(data);
            setupObservationForm();
            displayObservationsTable();
            displayComplianceSummary(data);
        });
    } catch (error) {
        console.error('Error initializing observer dashboard:', error);
        showNotification('Error loading dashboard', 'danger');
    }
}

/**
 * Display observer statistics
 * @param {Object} data - Mock election data
 */
function displayObserverStats(data) {
    try {
        const stats = getObservationStats();
        
        document.getElementById('observation-count').textContent = stats.observationCount;
        document.getElementById('monitored-stations').textContent = stats.stationsMonitored;
        document.getElementById('incidents-count').textContent = stats.incidentsReported;
        document.getElementById('compliance-rate').textContent = stats.complianceRate + '%';
    } catch (error) {
        console.error('Error displaying observer stats:', error);
    }
}

/**
 * Setup observation form
 */
function setupObservationForm() {
    try {
        const form = document.getElementById('observation-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitObservation();
        });
    } catch (error) {
        console.error('Error setting up observation form:', error);
    }
}

/**
 * Submit observation
 */
function submitObservation() {
    try {
        const user = getCurrentUser();
        const formData = {
            id: generateId(),
            title: document.getElementById('obs-title').value,
            station: document.getElementById('obs-station').value,
            time: document.getElementById('obs-time').value,
            type: document.getElementById('obs-type').value,
            description: document.getElementById('obs-details').value,
            severity: document.getElementById('obs-severity').value,
            timestamp: new Date().toISOString(),
            userEmail: user.email
        };
        
        // Validate required fields
        if (!formData.title || !formData.station || !formData.time || !formData.type || !formData.description) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        // Add observation using storage module
        addObservation(formData);
        
        // Show success message
        document.getElementById('obs-success-message').style.display = 'block';
        
        // Reset form
        document.getElementById('observation-form').reset();
        
        // Refresh displays
        displayObservationsTable();
        loadMockData().then(data => {
            displayObserverStats(data);
            displayComplianceSummary(data);
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            document.getElementById('obs-success-message').style.display = 'none';
        }, 5000);
        
        showNotification('Observation logged successfully!', 'success');
    } catch (error) {
        console.error('Error submitting observation:', error);
        showNotification('Error submitting observation', 'danger');
    }
}

/**
 * Display observations in table
 */
function displayObservationsTable() {
    try {
        const tbody = document.getElementById('observations-table-body');
        if (!tbody) return;
        
        const observations = getAllObservations();
        
        if (observations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No observations logged yet</td></tr>';
            return;
        }
        
        // Sort by timestamp descending
        observations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        tbody.innerHTML = observations.map(obs => {
            const dateTime = new Date(obs.timestamp).toLocaleString();
            const severityClass = obs.severity === 'none' ? 'low' : obs.severity;
            return `
                <tr>
                    <td>${dateTime}</td>
                    <td>${escapeHtmlLocal(obs.station)}</td>
                    <td>${escapeHtmlLocal(obs.type)}</td>
                    <td>${escapeHtmlLocal(obs.description.substring(0, 50))}...</td>
                    <td><span class="status-badge ${severityClass}">${obs.severity.toUpperCase()}</span></td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying observations table:', error);
    }
}

/**
 * Display station compliance summary
 * @param {Object} data - Mock election data
 */
function displayComplianceSummary(data) {
    try {
        const tbody = document.getElementById('compliance-table-body');
        if (!tbody) return;
        
        const observations = getAllObservations();
        const pollingStations = data.pollingStations || [];
        
        // Group observations by station
        const stationObservations = {};
        observations.forEach(obs => {
            if (!stationObservations[obs.station]) {
                stationObservations[obs.station] = [];
            }
            stationObservations[obs.station].push(obs);
        });
        
        if (Object.keys(stationObservations).length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No station data available</td></tr>';
            return;
        }
        
        tbody.innerHTML = Object.entries(stationObservations).map(([station, obsArray]) => {
            const hasIssues = obsArray.some(obs => obs.severity !== 'none');
            const status = hasIssues ? 'pending' : 'active';
            const lastObs = obsArray[obsArray.length - 1];
            
            return `
                <tr>
                    <td>${escapeHtmlLocal(station)}</td>
                    <td>${getStatusBadge(status === 'active' ? 'Compliant' : 'Issues Detected')}</td>
                    <td>${new Date(lastObs.timestamp).toLocaleString()}</td>
                    <td>${obsArray.length} observation(s)</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error displaying compliance summary:', error);
    }
}

/**
 * Refresh observer data
 */
function observerRefreshData() {
    try {
        initializeObserverDashboard();
        showNotification('Dashboard refreshed', 'success', 2000);
    } catch (error) {
        console.error('Error refreshing data:', error);
        showNotification('Error refreshing data', 'danger');
    }
}

/**
 * Export observations report
 */
function observerExportReport() {
    try {
        const observations = loadFromLocalStorage('observer_observations') || [];
        
        if (observations.length === 0) {
            showNotification('No observations to export', 'warning');
            return;
        }
        
        const csv = convertToCSV(observations.map(obs => ({
            date: obs.date,
            time: obs.time,
            station: obs.station,
            type: obs.type,
            severity: obs.severity,
            details: obs.details
        })));
        
        downloadCSV(csv, 'observations-report.csv');
        showNotification('Report exported successfully', 'success');
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
function escapeHtmlLocal(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeObserverDashboard);
} else {
    initializeObserverDashboard();
}
