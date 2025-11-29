// ===================================
// Election Monitoring System - Main JS
// =================================== 

/**
 * Navigate to a specific role's dashboard
 * @param {string} role - The role name (admin, citizen, observer, analyst)
 */
function navigateToRole(role) {
    const roles = {
        'admin': 'admin.html',
        'citizen': 'citizen.html',
        'observer': 'observer.html',
        'analyst': 'analyst.html'
    };

    if (roles[role]) {
        window.location.href = roles[role];
    } else {
        console.error('Invalid role:', role);
    }
}

/**
 * Load mock data from JSON file
 * @returns {Promise<Object>} Mock election data
 */
async function loadMockData() {
    try {
        const response = await fetch('data/mock-data.json');
        if (!response.ok) {
            throw new Error('Failed to load mock data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading mock data:', error);
        return getDefaultMockData();
    }
}

/**
 * Get default mock data when JSON file is unavailable
 * @returns {Object} Default mock data
 */
function getDefaultMockData() {
    return {
        election: {
            name: 'General Election 2025',
            date: '2025-12-15',
            status: 'Planning',
            pollingHours: '7:00 AM - 6:00 PM',
            requiredDocuments: 'Valid ID, Voter Card',
            totalVoters: 50000
        },
        pollingStations: [
            { id: 'PS001', name: 'Central High School', location: 'Downtown', capacity: 500, currentVoters: 0, status: 'Ready' },
            { id: 'PS002', name: 'Community Center A', location: 'North District', capacity: 400, currentVoters: 0, status: 'Ready' },
            { id: 'PS003', name: 'Library Branch', location: 'East Side', capacity: 350, currentVoters: 0, status: 'Ready' },
            { id: 'PS004', name: 'Sports Complex', location: 'West Area', capacity: 600, currentVoters: 0, status: 'Ready' },
            { id: 'PS005', name: 'Town Hall', location: 'Central', capacity: 450, currentVoters: 0, status: 'Ready' }
        ],
        issues: [],
        observations: [],
        analytics: {
            totalVotes: 0,
            avgVotingTime: 0,
            turnoutRate: 0,
            anomalies: 0
        }
    };
}

/**
 * Initialize page - load data and setup event listeners
 */
function initializePage() {
    try {
        console.log('Initializing Election Monitoring System...');
        // Page-specific initialization will be handled by role-specific JS files
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Format time to readable format
 * @param {string} timeString - Time string (HH:MM)
 * @returns {string} Formatted time
 */
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Show notification/alert to user
 * @param {string} message - Message to display
 * @param {string} type - Type of alert (success, warning, danger)
 * @param {number} duration - Duration in ms (default: 5000)
 */
function showNotification(message, type = 'success', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '400px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, duration);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Debounce function to prevent excessive function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @returns {*} Stored data or null
 */
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Clear localStorage data
 * @param {string} key - Storage key (optional, clear all if not provided)
 */
function clearLocalStorage(key) {
    try {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Utility to safely access nested object properties
 * @param {Object} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @returns {*} Property value or undefined
 */
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Convert array to CSV string
 * @param {Array} data - Array of objects
 * @returns {string} CSV string
 */
function convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content
 * @param {string} filename - Filename for download
 */
function downloadCSV(csvContent, filename = 'report.csv') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

/**
 * Get status badge HTML
 * @param {string} status - Status value
 * @returns {string} HTML string
 */
function getStatusBadge(status) {
    const statusMap = {
        'active': 'active',
        'ready': 'active',
        'pending': 'pending',
        'completed': 'active',
        'inactive': 'inactive',
        'error': 'inactive'
    };
    
    const badgeClass = statusMap[status.toLowerCase()] || 'pending';
    return `<span class="status-badge ${badgeClass}">${status}</span>`;
}

// Initialize page when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
