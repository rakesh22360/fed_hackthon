// ===================================
// Election Monitoring System - Storage Module
// Centralized localStorage management
// =================================== 

/**
 * User Management
 */

/**
 * Get all registered users
 * @returns {Array} Array of user objects
 */
function getUsers() {
    try {
        const users = localStorage.getItem('ems_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Add new user (during signup)
 * @param {Object} user - User object with email, password, name, role
 * @returns {boolean} Success status
 */
function addUser(user) {
    try {
        const users = getUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === user.email)) {
            return false; // Duplicate email
        }
        
        // Add user with timestamp
        user.createdAt = new Date().toISOString();
        users.push(user);
        
        localStorage.setItem('ems_users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error adding user:', error);
        return false;
    }
}

/**
 * Find user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User object if found, null otherwise
 */
function findUser(email, password) {
    try {
        const users = getUsers();
        return users.find(u => u.email === email && u.password === password) || null;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
}

/**
 * Set current logged-in user
 * @param {Object} user - User object
 */
function setCurrentUser(user) {
    try {
        localStorage.setItem('ems_current_user', JSON.stringify(user));
    } catch (error) {
        console.error('Error setting current user:', error);
    }
}

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem('ems_current_user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Logout current user
 */
function logoutUser() {
    try {
        localStorage.removeItem('ems_current_user');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Guard: Redirect to login if not logged in
 */
function authGuard() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Issue Management (for Citizens)
 */

/**
 * Get all issues
 * @returns {Array} Array of issue objects
 */
function getAllIssues() {
    try {
        const issues = localStorage.getItem('citizen_issues');
        return issues ? JSON.parse(issues) : [];
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
}

/**
 * Add new issue
 * @param {Object} issue - Issue object
 * @returns {boolean} Success status
 */
function addIssue(issue) {
    try {
        issue.id = generateId();
        issue.timestamp = new Date().toISOString();
        issue.status = 'open';
        
        const issues = getAllIssues();
        issues.push(issue);
        
        localStorage.setItem('citizen_issues', JSON.stringify(issues));
        return true;
    } catch (error) {
        console.error('Error adding issue:', error);
        return false;
    }
}

/**
 * Get active issues count
 * @returns {number} Count of open issues
 */
function getActiveIssuesCount() {
    try {
        const issues = getAllIssues();
        return issues.filter(issue => issue.status === 'open').length;
    } catch (error) {
        console.error('Error getting active issues count:', error);
        return 0;
    }
}

/**
 * Get issues for current user (citizen)
 * @returns {Array} Issues submitted by current user
 */
function getUserIssues() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];
        
        const issues = getAllIssues();
        return issues.filter(issue => issue.userEmail === currentUser.email);
    } catch (error) {
        console.error('Error getting user issues:', error);
        return [];
    }
}

/**
 * Delete issue by ID
 * @param {string} issueId - Issue ID
 * @returns {boolean} Success status
 */
function deleteIssue(issueId) {
    try {
        let issues = getAllIssues();
        issues = issues.filter(issue => issue.id !== issueId);
        localStorage.setItem('citizen_issues', JSON.stringify(issues));
        return true;
    } catch (error) {
        console.error('Error deleting issue:', error);
        return false;
    }
}

/**
 * Observation Management (for Observers)
 */

/**
 * Get all observations
 * @returns {Array} Array of observation objects
 */
function getAllObservations() {
    try {
        const observations = localStorage.getItem('ems_observations');
        return observations ? JSON.parse(observations) : [];
    } catch (error) {
        console.error('Error getting observations:', error);
        return [];
    }
}

/**
 * Add new observation
 * @param {Object} observation - Observation object
 * @returns {boolean} Success status
 */
function addObservation(observation) {
    try {
        observation.id = generateId();
        observation.timestamp = new Date().toISOString();
        observation.userEmail = getCurrentUser()?.email || 'unknown';
        
        const observations = getAllObservations();
        observations.push(observation);
        
        localStorage.setItem('ems_observations', JSON.stringify(observations));
        return true;
    } catch (error) {
        console.error('Error adding observation:', error);
        return false;
    }
}

/**
 * Get observations for current user (observer)
 * @returns {Array} Observations logged by current user
 */
function getUserObservations() {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];
        
        const observations = getAllObservations();
        return observations.filter(obs => obs.userEmail === currentUser.email);
    } catch (error) {
        console.error('Error getting user observations:', error);
        return [];
    }
}

/**
 * Get observation statistics
 * @returns {Object} Statistics object
 */
function getObservationStats() {
    try {
        const observations = getAllObservations();
        const uniqueStations = new Set(observations.map(obs => obs.station)).size;
        const incidents = observations.filter(obs => obs.severity && obs.severity !== 'none').length;
        const complianceRate = uniqueStations > 0 
            ? Math.max(0, Math.round(((uniqueStations - incidents) / uniqueStations) * 100))
            : 0;
        
        return {
            observationCount: observations.length,
            stationsMonitored: uniqueStations,
            incidentsReported: incidents,
            complianceRate: complianceRate
        };
    } catch (error) {
        console.error('Error getting observation stats:', error);
        return {
            observationCount: 0,
            stationsMonitored: 0,
            incidentsReported: 0,
            complianceRate: 0
        };
    }
}

/**
 * Utility Functions
 */

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if strong enough
 */
function isValidPassword(password) {
    return password && password.length >= 6;
}

/**
 * Show authentication errors
 * @param {string} message - Error message
 */
function showAuthError(message) {
    const errorDiv = document.getElementById('auth-error') || document.createElement('div');
    errorDiv.id = 'auth-error';
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '9999';
    errorDiv.style.maxWidth = '400px';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Show authentication success
 * @param {string} message - Success message
 */
function showAuthSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '9999';
    successDiv.style.maxWidth = '400px';
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

/**
 * Update navbar to show user status
 * Automatically called after login/logout
 */
function updateUserDisplay() {
    const currentUser = getCurrentUser();
    const navBrand = document.querySelector('.nav-brand');
    
    if (!navBrand) return;
    
    if (currentUser) {
        // User is logged in
        const userDisplayHTML = `
            <a href="index.html" class="nav-logo">🗳️ EMS</a>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-weight: 500; color: #1e293b;">${escapeHtml(currentUser.name)}</span>
                <span class="role-badge">${currentUser.role}</span>
                <button class="btn btn-secondary" onclick="handleLogout()" style="padding: 6px 12px; font-size: 12px;">Logout</button>
            </div>
        `;
        navBrand.innerHTML = userDisplayHTML;
    } else {
        // User is not logged in (only on index.html)
        const indexDisplay = `
            <a href="index.html" class="nav-logo">🗳️ EMS</a>
            <h1 style="margin: 0; font-size: 28px;">Election Monitoring System</h1>
        `;
        navBrand.innerHTML = indexDisplay;
    }
}

/**
 * Handle logout button click
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
        window.location.href = 'login.html';
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
