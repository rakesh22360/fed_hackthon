# Election Monitoring System - API Documentation

## Overview
This is the backend API for the Election Monitoring System built with Node.js, Express, and MongoDB.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
DB_NAME=election_monitoring
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
npm start
# or
npm run dev
```

The server will run on `http://localhost:5000`

---

## API Endpoints

### Health Check
- **GET** `/api/health`
  - Check if server is running

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "citizen",
    "phone": "1234567890",
    "location": "City, State"
  }
  ```
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Polling Stations
- **GET** `/api/stations` - Get all polling stations
- **GET** `/api/stations/:id` - Get station by ID
- **POST** `/api/stations` - Create new polling station
  ```json
  {
    "name": "Station A",
    "location": {
      "address": "123 Main St",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "capacity": 500,
    "votingHours": {
      "startTime": "08:00 AM",
      "endTime": "06:00 PM"
    }
  }
  ```
- **PUT** `/api/stations/:id` - Update polling station
- **DELETE** `/api/stations/:id` - Delete polling station

### Reports
- **GET** `/api/reports` - Get all reports
- **GET** `/api/reports/:id` - Get report by ID
- **GET** `/api/reports/station/:stationId` - Get reports for a station
- **GET** `/api/reports/user/:userId` - Get reports by user
- **POST** `/api/reports` - Create new report
  ```json
  {
    "reporter": "user_id",
    "pollingStation": "station_id",
    "type": "crowd_level",
    "description": "High crowd at station",
    "severity": "medium",
    "crowdLevel": "high"
  }
  ```
- **PUT** `/api/reports/:id` - Update report status
  ```json
  {
    "status": "resolved",
    "isVerified": true,
    "verifiedBy": "admin_id"
  }
  ```

---

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* Data payload */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Database Models

### User
- name (String)
- email (String) - Unique
- password (String)
- role (String) - citizen, admin, observer, analyst
- phone (String)
- location (String)
- isActive (Boolean)
- timestamps

### PollingStation
- name (String)
- location (Object) - address, latitude, longitude
- capacity (Number)
- currentCrowdLevel (String) - low, medium, high
- votingHours (Object)
- officialInCharge (Reference to User)
- totalVoters (Number)
- votersTurnout (Number)
- isOpen (Boolean)
- timestamps

### Report
- reporter (Reference to User)
- pollingStation (Reference to PollingStation)
- type (String) - crowd_level, issue, observation, irregularity
- description (String)
- severity (String) - low, medium, high, critical
- status (String) - reported, under_review, resolved, closed
- crowdLevel (String)
- timestamp (Date)
- attachments (Array of Strings)
- isVerified (Boolean)
- verifiedBy (Reference to User)
- timestamps

---

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, production)

---

## Features

✅ User Management (Create, Read, Update, Delete)
✅ Polling Station Management
✅ Report Management with Verification
✅ MongoDB Integration
✅ CORS Enabled
✅ Error Handling
✅ Health Check Endpoint

---

## Notes

- Passwords are not returned in API responses
- All timestamps are in ISO 8601 format
- Database connection is automatic on server start
- API is currently unsecured - add authentication middleware for production

---

## License
ISC

