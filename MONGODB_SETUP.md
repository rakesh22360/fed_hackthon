# MongoDB Integration Setup - Election Monitoring System

## ✅ Setup Complete!

Your MongoDB backend has been successfully configured and integrated with your Election Monitoring System.

---

## 📊 What's Been Created

### Backend Structure
```
server/
├── config/
│   └── database.js          # MongoDB connection configuration
├── models/
│   ├── User.js              # User schema and model
│   ├── PollingStation.js    # Polling station schema
│   └── Report.js            # Report schema
├── routes/
│   ├── users.js             # User CRUD API endpoints
│   ├── stations.js          # Polling station API endpoints
│   └── reports.js           # Report API endpoints
└── server.js                # Main Express server
```

### Key Files Created
- ✅ `.env` - Environment variables (protected by .gitignore)
- ✅ `.gitignore` - Git ignore rules to protect sensitive data
- ✅ `package.json` - Node.js dependencies configuration
- ✅ `API_DOCUMENTATION.md` - Complete API documentation

---

## 🚀 Server Status

**Backend Server:** Running on `http://localhost:5000`
**Frontend Server:** Running on `http://localhost:8000`
**Database:** Connected to MongoDB Atlas

---

## 📡 API Endpoints Available

### Health Check
```
GET http://localhost:5000/api/health
```

### Users API
```
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by ID
POST   /api/users           - Create new user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

### Polling Stations API
```
GET    /api/stations        - Get all stations
GET    /api/stations/:id    - Get station by ID
POST   /api/stations        - Create new station
PUT    /api/stations/:id    - Update station
DELETE /api/stations/:id    - Delete station
```

### Reports API
```
GET    /api/reports                        - Get all reports
GET    /api/reports/:id                    - Get report by ID
GET    /api/reports/station/:stationId     - Get reports for station
GET    /api/reports/user/:userId           - Get user's reports
POST   /api/reports                        - Create new report
PUT    /api/reports/:id                    - Update report status
```

---

## 💾 MongoDB Collections

Your MongoDB database contains 3 collections:

### 1. **users**
Stores voter, observer, analyst, and admin information
```javascript
{
  name, email, password, role, phone, location, isActive, timestamps
}
```

### 2. **pollingstations**
Stores polling station details and crowd status
```javascript
{
  name, location, capacity, currentCrowdLevel, votingHours, 
  officialInCharge, totalVoters, votersTurnout, isOpen, timestamps
}
```

### 3. **reports**
Stores citizen reports, observations, and irregularities
```javascript
{
  reporter, pollingStation, type, description, severity, status,
  crowdLevel, attachments, isVerified, verifiedBy, timestamps
}
```

---

## 🔐 Security Configuration

### Protected Credentials
- `MONGODB_URI` - Stored in `.env`
- `.env` file is in `.gitignore` to prevent accidental commits
- `.gitignore` also excludes `node_modules/` and log files

### Environment Variables
```
MONGODB_URI=mongodb+srv://rakeshbabujampani5_db_user:8I6kQskEbJght8G5@cluster0.oup4y02.mongodb.net/?appName=Cluster0
DB_NAME=election_monitoring
PORT=5000
NODE_ENV=development
```

---

## 🎯 Quick Start Guide

### 1. Start Both Servers

**Terminal 1 - Backend (Port 5000):**
```powershell
cd c:\Users\RAKESH\OneDrive\Documents\fed_project\election-monitoring
node server/server.js
```

**Terminal 2 - Frontend (Port 8000):**
```powershell
cd c:\Users\RAKESH\OneDrive\Documents\fed_project\election-monitoring
python -m http.server 8000
```

### 2. Test the API

Using your browser or Postman:
```
GET http://localhost:5000/api/health
GET http://localhost:5000/api/users
GET http://localhost:5000/api/stations
GET http://localhost:5000/api/reports
```

### 3. Access Frontend
```
http://localhost:8000
```

---

## 📝 Example API Requests

### Create a New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "password": "secure123",
    "role": "citizen",
    "phone": "9876543210",
    "location": "Delhi, India"
  }'
```

### Create a Polling Station
```bash
curl -X POST http://localhost:5000/api/stations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Government School - Station A",
    "location": {
      "address": "123 Main Street, Delhi",
      "latitude": 28.7041,
      "longitude": 77.1025
    },
    "capacity": 500,
    "votingHours": {
      "startTime": "08:00 AM",
      "endTime": "06:00 PM"
    }
  }'
```

### Submit a Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "reporter": "user_id_here",
    "pollingStation": "station_id_here",
    "type": "crowd_level",
    "description": "High crowd at the voting station",
    "severity": "medium",
    "crowdLevel": "high"
  }'
```

---

## 🔧 Configuration Details

### MongoDB Connection String
- **Provider:** MongoDB Atlas
- **Cluster:** Cluster0
- **Database:** election_monitoring
- **User:** rakeshbabujampani5_db_user

### Server Configuration
- **Framework:** Express.js
- **Port:** 5000
- **Database:** MongoDB via Mongoose
- **CORS:** Enabled for all origins
- **Body Parser:** JSON and URL-encoded

---

## 📚 Next Steps

1. **Frontend Integration:** Connect your HTML frontend to the backend API
2. **Authentication:** Add JWT authentication for secure endpoints
3. **Validation:** Add input validation middleware
4. **Testing:** Create unit and integration tests
5. **Deployment:** Deploy to production server or cloud platform

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```
Error: MongoDB Connection Error
Solution: Check MONGODB_URI in .env file and ensure your IP is whitelisted in MongoDB Atlas
```

### Port Already in Use
```
Error: Address already in use
Solution: Kill existing process on port 5000 or change PORT in .env
```

### Module Not Found
```
Error: Cannot find module 'express'
Solution: Run `npm install` to install dependencies
```

---

## 📞 Support

For API documentation details, see: `API_DOCUMENTATION.md`
For database schema details, see: `server/models/` directory

---

## ✨ Features Implemented

✅ MongoDB Atlas connection
✅ User management (CRUD operations)
✅ Polling station management
✅ Report submission and tracking
✅ Data validation with Mongoose schemas
✅ RESTful API endpoints
✅ Error handling and response formatting
✅ CORS enabled for frontend integration
✅ Environment variable configuration
✅ Git security (sensitive data protection)

---

**Last Updated:** November 30, 2025
**Status:** ✅ Ready for Development

