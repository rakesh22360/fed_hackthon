# Frontend-Backend Integration Guide

## Overview

Your Election Monitoring System now has full frontend-backend integration with MongoDB. All pages are connected to the backend API for real-time data management.

---

## 📚 New JavaScript Files

### 1. **api-client.js** 
Complete API client for communicating with the backend.

**Available Functions:**

#### User API
```javascript
userAPI.getAll()              // Get all users
userAPI.getById(id)           // Get user by ID
userAPI.create(userData)      // Create new user (Sign up)
userAPI.update(id, userData)  // Update user
userAPI.delete(id)            // Delete user
userAPI.login(email, password) // Login user
```

#### Station API
```javascript
stationAPI.getAll()           // Get all stations
stationAPI.getById(id)        // Get station by ID
stationAPI.create(data)       // Create new station
stationAPI.update(id, data)   // Update station
stationAPI.delete(id)         // Delete station
stationAPI.updateCrowdLevel(id, level) // Update crowd level
```

#### Report API
```javascript
reportAPI.getAll()            // Get all reports
reportAPI.getById(id)         // Get report by ID
reportAPI.create(data)        // Create new report
reportAPI.update(id, data)    // Update report
reportAPI.getByStation(id)    // Get station reports
reportAPI.getByUser(id)       // Get user reports
reportAPI.submitCrowdReport(stationId, userId, crowdLevel)
reportAPI.submitIssue(stationId, userId, description, severity)
```

#### System API
```javascript
systemAPI.healthCheck()       // Check backend status
```

---

### 2. **auth.js**
Complete authentication and session management.

**Key Functions:**

#### Authentication
```javascript
AuthManager.register(userData)        // Sign up new user
AuthManager.login(email, password)    // Login user
AuthManager.logout()                  // Logout user
AuthManager.isLoggedIn()              // Check if logged in
```

#### User Info
```javascript
AuthManager.getCurrentUser()          // Get current user object
AuthManager.getToken()                // Get auth token
AuthManager.getDisplayName()          // Get user's display name
AuthManager.getEmail()                // Get user's email
AuthManager.getUserId()               // Get user's ID
AuthManager.getUserRole()             // Get user's role
AuthManager.getRoleDisplay()          // Get formatted role display
```

#### Permissions
```javascript
AuthManager.canCreateReports()        // Can user create reports?
AuthManager.canViewAllReports()       // Can user view all reports?
AuthManager.canManageStations()       // Can user manage stations?
AuthManager.canManageUsers()          // Can user manage users?
AuthManager.hasRole(role)             // Check specific role
```

#### Session Management
```javascript
AuthManager.setCurrentUser(user)      // Store user session
AuthManager.isSessionValid()          // Check session validity
AuthManager.getSessionDuration()      // Get session duration in minutes
AuthManager.updateProfile(id, data)   // Update user profile
AuthManager.changePassword(id, old, new) // Change password
```

---

## 🔌 Integration Examples

### Example 1: Sign Up Form
```javascript
async function handleSignup(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        role: 'citizen'
    };
    
    const result = await AuthManager.register(userData);
    
    if (result.success) {
        alert('Account created! Please login.');
        window.location.href = 'login.html';
    } else {
        alert('Error: ' + result.message);
    }
}
```

### Example 2: Login
```javascript
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await AuthManager.login(email, password);
    
    if (result.success) {
        alert('Login successful!');
        // Redirect to dashboard
        window.location.href = 'citizen.html';
    } else {
        alert('Error: ' + result.message);
    }
}
```

### Example 3: Get Polling Stations
```javascript
async function loadStations() {
    try {
        const response = await stationAPI.getAll();
        const stations = response.data;
        
        stations.forEach(station => {
            console.log(`${station.name} - Crowd: ${station.currentCrowdLevel}`);
        });
    } catch (error) {
        console.error('Error loading stations:', error);
    }
}
```

### Example 4: Submit a Report
```javascript
async function submitCrowdReport(stationId, crowdLevel) {
    const userId = AuthManager.getUserId();
    
    try {
        const result = await reportAPI.submitCrowdReport(
            stationId,
            userId,
            crowdLevel
        );
        
        if (result.success) {
            alert('Report submitted successfully!');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
    }
}
```

### Example 5: View User's Reports
```javascript
async function viewMyReports() {
    const userId = AuthManager.getUserId();
    
    try {
        const response = await reportAPI.getByUser(userId);
        const reports = response.data;
        
        reports.forEach(report => {
            console.log(`Report: ${report.description} (${report.status})`);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}
```

### Example 6: Update Station Crowd Level
```javascript
async function updateCrowdLevel(stationId, newLevel) {
    try {
        const result = await stationAPI.updateCrowdLevel(stationId, newLevel);
        
        if (result.success) {
            console.log('Crowd level updated successfully!');
        }
    } catch (error) {
        console.error('Error updating crowd level:', error);
    }
}
```

---

## 🔐 Authentication Flow

### Sign Up
1. User fills signup form
2. `AuthManager.register()` is called
3. User data is sent to backend via `userAPI.create()`
4. User object is stored in localStorage
5. User is redirected to login page

### Login
1. User fills login form
2. `AuthManager.login()` is called
3. Backend verifies credentials
4. User object is stored in localStorage
5. User is redirected to their dashboard

### Session Management
- Auth token stored in `localStorage['authToken']`
- User data stored in `localStorage['ems_current_user']`
- Session tracked with timestamp
- Auto-logout after 30 minutes (configurable)

### Logout
1. User clicks logout button
2. `AuthManager.logout()` clears session
3. User is redirected to home page

---

## 🎯 Page-Specific Integration

### index.html (Home Page)
- Loads API client and auth scripts
- Checks if user is logged in
- Shows login button or user info based on auth state
- Initializes lightbox for gallery

### login.html (Login Page)
```javascript
// Form submission calls handleLogin()
// Which uses AuthManager.login()
// Then redirects to appropriate dashboard
```

### signup.html (Sign Up Page)
```javascript
// Form submission calls handleSignup()
// Which uses AuthManager.register()
// Then redirects to login.html
```

### citizen.html (Voter Dashboard)
- Uses `stationAPI.getAll()` to load polling stations
- Uses `reportAPI.submitCrowdReport()` for crowd reporting
- Displays reports using `reportAPI.getByStation()`
- Checks permissions with `AuthManager.canCreateReports()`

### admin.html (Admin Dashboard)
- Uses `userAPI.getAll()` to manage users
- Uses `stationAPI` to manage stations
- Can verify and review reports
- Full access to all data

### observer.html (Observer Dashboard)
- Views all stations with `stationAPI.getAll()`
- Submits observations with `reportAPI.submitIssue()`
- Views reports with `reportAPI.getAll()`
- Limited write permissions

### analyst.html (Analyst Dashboard)
- Analyzes data from `reportAPI.getAll()`
- Generates statistics from report data
- Views all polling stations
- Read-only access

---

## 📡 Backend Endpoints Reference

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stations
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station by ID
- `POST /api/stations` - Create station
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/station/:stationId` - Get station reports
- `GET /api/reports/user/:userId` - Get user reports
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report

### Health
- `GET /api/health` - Check server status

---

## 🧪 Testing the Integration

### 1. Check Backend Connection
```javascript
systemAPI.healthCheck().then(result => {
    console.log(result.success ? '✅ Backend Online' : '❌ Backend Offline');
});
```

### 2. Create a Test User
```javascript
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
    role: 'citizen'
};
userAPI.create(testUser).then(result => {
    console.log(result.success ? '✅ User Created' : '❌ Error');
});
```

### 3. Get All Stations
```javascript
stationAPI.getAll().then(response => {
    console.log('✅ Loaded ' + response.count + ' stations');
    console.log(response.data);
});
```

---

## 🔒 Data Storage

### LocalStorage Keys
- `ems_current_user` - Current logged-in user object
- `authToken` - Authentication token
- `ems_session_start` - Session start timestamp
- `ems_seen_welcome` - Welcome modal flag

### MongoDB Collections
- `users` - User accounts and profiles
- `pollingstations` - Polling station details
- `reports` - Citizen reports and observations

---

## ⚠️ Important Notes

1. **Security**: This is a development setup. For production, implement proper authentication (JWT).

2. **Password Security**: Passwords are currently stored in plain text. Use bcrypt for production.

3. **API Error Handling**: All API calls should have try-catch blocks.

4. **Session Timeout**: Default is 30 minutes. Configure in auth.js if needed.

5. **CORS**: Backend has CORS enabled for localhost. Configure for production.

---

## 📝 Troubleshooting

### Issue: "Backend server is not running"
**Solution**: Start the backend with `node server/server.js`

### Issue: "User not found" during login
**Solution**: Make sure user was registered first via signup page

### Issue: API returns 404
**Solution**: Check endpoint URL and method in api-client.js

### Issue: CORS error
**Solution**: Ensure backend is running and CORS is enabled

---

## 📚 Next Steps

1. **Add Real Authentication**: Implement JWT-based authentication
2. **Email Verification**: Add email confirmation for sign-ups
3. **Data Validation**: Add frontend validation for all forms
4. **Error Handling**: Implement comprehensive error handling UI
5. **Caching**: Add data caching for better performance
6. **Offline Support**: Add Service Workers for offline functionality

---

**Status**: ✅ Frontend-Backend Integration Complete
**Last Updated**: November 30, 2025

