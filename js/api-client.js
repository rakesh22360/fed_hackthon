/**
 * API Client Utility
 * Handles all backend API calls for the Election Monitoring System
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ============================================
// API Configuration
// ============================================

const apiClient = {
  baseURL: API_BASE_URL,
  
  /**
   * Make HTTP requests to the backend
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      token = localStorage.getItem('authToken'),
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  },
};

// ============================================
// User API Endpoints
// ============================================

const userAPI = {
  /**
   * Get all users
   */
  async getAll() {
    return apiClient.request('/users');
  },

  /**
   * Get user by ID
   */
  async getById(id) {
    return apiClient.request(`/users/${id}`);
  },

  /**
   * Create new user (Sign up)
   */
  async create(userData) {
    return apiClient.request('/users', {
      method: 'POST',
      body: userData,
    });
  },

  /**
   * Update user
   */
  async update(id, userData) {
    return apiClient.request(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  },

  /**
   * Delete user
   */
  async delete(id) {
    return apiClient.request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Login user (Get user by email and verify)
   */
  async login(email, password) {
    const users = await this.getAll();
    const user = users.data.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Note: In production, use proper authentication endpoint
    // For now, we're using client-side validation
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    return { success: true, data: user };
  },
};

// ============================================
// Polling Station API Endpoints
// ============================================

const stationAPI = {
  /**
   * Get all polling stations
   */
  async getAll() {
    return apiClient.request('/stations');
  },

  /**
   * Get polling station by ID
   */
  async getById(id) {
    return apiClient.request(`/stations/${id}`);
  },

  /**
   * Create new polling station
   */
  async create(stationData) {
    return apiClient.request('/stations', {
      method: 'POST',
      body: stationData,
    });
  },

  /**
   * Update polling station
   */
  async update(id, stationData) {
    return apiClient.request(`/stations/${id}`, {
      method: 'PUT',
      body: stationData,
    });
  },

  /**
   * Delete polling station
   */
  async delete(id) {
    return apiClient.request(`/stations/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update crowd level at station (PATCH)
   */
  async updateCrowdLevel(id, crowdLevel) {
    return apiClient.request(`/stations/${id}/crowd-level`, {
      method: 'PATCH',
      body: { currentCrowdLevel: crowdLevel },
    });
  },

  /**
   * Get stations by crowd level
   */
  async getByCrewdLevel(level) {
    return apiClient.request(`/stations/filter/crowd-level/${level}`);
  },
};

// ============================================
// Report API Endpoints
// ============================================

const reportAPI = {
  /**
   * Get all reports
   */
  async getAll() {
    return apiClient.request('/reports');
  },

  /**
   * Get report by ID
   */
  async getById(id) {
    return apiClient.request(`/reports/${id}`);
  },

  /**
   * Create new report
   */
  async create(reportData) {
    return apiClient.request('/reports', {
      method: 'POST',
      body: reportData,
    });
  },

  /**
   * Update report
   */
  async update(id, reportData) {
    return apiClient.request(`/reports/${id}`, {
      method: 'PUT',
      body: reportData,
    });
  },

  /**
   * Get reports for a specific polling station
   */
  async getByStation(stationId) {
    return apiClient.request(`/reports/station/${stationId}`);
  },

  /**
   * Get reports by user/reporter
   */
  async getByUser(userId) {
    return apiClient.request(`/reports/user/${userId}`);
  },

  /**
   * Submit a crowd level report
   */
  async submitCrowdReport(stationId, userId, crowdLevel) {
    return this.create({
      reporter: userId,
      pollingStation: stationId,
      type: 'crowd_level',
      description: `Current crowd level: ${crowdLevel}`,
      crowdLevel: crowdLevel,
      severity: crowdLevel === 'high' ? 'medium' : 'low',
    });
  },

  /**
   * Submit an issue report
   */
  async submitIssue(stationId, userId, description, severity = 'medium') {
    return this.create({
      reporter: userId,
      pollingStation: stationId,
      type: 'issue',
      description: description,
      severity: severity,
    });
  },
};

// ============================================
// Health Check
// ============================================

const systemAPI = {
  /**
   * Check if backend server is running
   */
  async healthCheck() {
    try {
      return await apiClient.request('/health');
    } catch (error) {
      return { success: false, message: 'Backend server is not running' };
    }
  },
};

// Export all APIs
window.apiClient = apiClient;
window.userAPI = userAPI;
window.stationAPI = stationAPI;
window.reportAPI = reportAPI;
window.systemAPI = systemAPI;

console.log('✅ API Client loaded successfully');
