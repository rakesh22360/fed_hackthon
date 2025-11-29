/**
 * Authentication Module
 * Handles user login, signup, logout, and session management
 */

const AuthManager = {
  // Storage keys
  STORAGE_KEYS: {
    USER: 'ems_current_user',
    TOKEN: 'authToken',
    SESSION_START: 'ems_session_start',
  },

  // ============================================
  // User Registration (Sign Up)
  // ============================================

  async register(userData) {
    try {
      console.log('📝 Registering user:', userData.email);
      
      const response = await userAPI.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        location: userData.location || '',
        role: userData.role || 'citizen',
      });

      if (response.success) {
        console.log('✅ User registered successfully');
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      return { success: false, message: error.message };
    }
  },

  // ============================================
  // User Login
  // ============================================

  async login(email, password) {
    try {
      console.log('🔐 Logging in user:', email);

      // Get all users and find match
      const response = await userAPI.getAll();
      const user = response.data.find(u => u.email === email);

      if (!user) {
        throw new Error('User not found. Please sign up first.');
      }

      // Simple password check (in production, use proper authentication)
      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Store user session
      this.setCurrentUser(user);

      console.log('✅ Login successful');
      return { success: true, data: user };
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return { success: false, message: error.message };
    }
  },

  // ============================================
  // User Logout
  // ============================================

  logout() {
    console.log('👋 Logging out user');
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.SESSION_START);
    console.log('✅ Logout successful');
  },

  // ============================================
  // Session Management
  // ============================================

  /**
   * Set current user in local storage
   */
  setCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, user._id || 'token_' + Date.now());
    localStorage.setItem(this.STORAGE_KEYS.SESSION_START, new Date().toISOString());
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Get current auth token
   */
  getToken() {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Get current user's role
   */
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.getUserRole() === role;
  },

  /**
   * Get session duration in minutes
   */
  getSessionDuration() {
    const sessionStart = localStorage.getItem(this.STORAGE_KEYS.SESSION_START);
    if (!sessionStart) return 0;

    const startTime = new Date(sessionStart);
    const now = new Date();
    return Math.floor((now - startTime) / (1000 * 60));
  },

  /**
   * Check if session is still valid (30 minutes max)
   */
  isSessionValid(maxDurationMinutes = 30) {
    return this.getSessionDuration() < maxDurationMinutes;
  },

  // ============================================
  // User Profile
  // ============================================

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    try {
      console.log('📝 Updating user profile');
      const response = await userAPI.update(userId, profileData);

      if (response.success) {
        this.setCurrentUser(response.data);
        console.log('✅ Profile updated successfully');
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error.message);
      return { success: false, message: error.message };
    }
  },

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = this.getCurrentUser();
      
      if (user.password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }

      const response = await userAPI.update(userId, { password: newPassword });

      if (response.success) {
        this.setCurrentUser(response.data);
        console.log('✅ Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Password change error:', error.message);
      return { success: false, message: error.message };
    }
  },

  // ============================================
  // Display Helpers
  // ============================================

  /**
   * Get user display name
   */
  getDisplayName() {
    const user = this.getCurrentUser();
    return user ? user.name : 'Guest';
  },

  /**
   * Get user email
   */
  getEmail() {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  },

  /**
   * Get user ID
   */
  getUserId() {
    const user = this.getCurrentUser();
    return user ? user._id : null;
  },

  /**
   * Get formatted role display
   */
  getRoleDisplay() {
    const role = this.getUserRole();
    const roleEmojis = {
      citizen: '👤 Voter',
      admin: '⚙️ Administrator',
      observer: '👁️ Observer',
      analyst: '📊 Analyst',
    };
    return roleEmojis[role] || role;
  },

  // ============================================
  // Permission Checks
  // ============================================

  /**
   * Can user create reports?
   */
  canCreateReports() {
    return ['citizen', 'observer', 'admin'].includes(this.getUserRole());
  },

  /**
   * Can user view all reports?
   */
  canViewAllReports() {
    return ['admin', 'analyst', 'observer'].includes(this.getUserRole());
  },

  /**
   * Can user manage stations?
   */
  canManageStations() {
    return this.hasRole('admin');
  },

  /**
   * Can user manage users?
   */
  canManageUsers() {
    return this.hasRole('admin');
  },
};

// Export to global scope
window.AuthManager = AuthManager;

console.log('✅ Authentication Manager loaded successfully');
