# 🗺️ Google Maps Integration - Setup Guide

## Overview

The Election Monitoring System now includes an interactive Google Maps integration that displays all polling stations with **live crowd level updates**. Citizens can:
- 📍 View all polling stations on a map
- 👥 See real-time crowd levels (Low/Medium/High)
- 🕐 Check voting hours for each station
- 📌 Click on stations to view detailed information
- 🔄 Automatically updates every 30 seconds

---

## Features

### 1. **Interactive Map Display**
- Shows all polling stations as colored markers
- Color coding based on crowd levels:
  - 🟢 **Green**: Low crowd
  - 🟡 **Amber**: Medium crowd
  - 🔴 **Red**: High crowd

### 2. **Live Updates**
- Automatically refreshes crowd level data every 30 seconds
- Manual refresh button available
- Real-time data from MongoDB database

### 3. **Station Information**
When you click on a station marker, you see:
- Station name and location
- Voting hours
- Current capacity
- Crowd level with visual indicator
- Contact number
- Status (Open/Closed)

### 4. **Integration Points**
- Shows location from database
- Displays hours from voting schedule
- Updates crowd levels in real-time from MongoDB

---

## Setup Instructions

### Step 1: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Maps JavaScript API**
4. Enable the **Places API** (optional, for advanced features)
5. Create an API Key in the Credentials section
6. Restrict the key to JavaScript origins (add your domain)

### Step 2: Update the API Key in Code

Find this line in `citizen.html`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=marker"></script>
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&libraries=marker"></script>
```

### Step 3: Update Database with Coordinates

Ensure your polling stations in MongoDB have proper coordinates. Update them like this:

```javascript
// MongoDB command to update a station
db.pollingstations.updateOne(
    { _id: ObjectId("...") },
    { $set: {
        "location.latitude": 28.6139,
        "location.longitude": 77.2090
    }}
)
```

Or use the API:
```javascript
// In browser console
await stationAPI.create({
    name: "Central High School",
    location: {
        address: "123 Main Street, Central City",
        latitude: 28.6139,
        longitude: 77.2090
    },
    capacity: 500,
    votingHours: {
        startTime: "7:00 AM",
        endTime: "6:00 PM"
    }
});
```

### Step 4: Test the Integration

1. Navigate to Citizen Dashboard
2. Click "View on Map" card
3. You should see the map with all polling stations
4. Click on any marker to see details
5. Click "Check Station" button to see more info

---

## File Structure

### New Files Created:
- `js/maps.js` - Complete Google Maps integration module

### Modified Files:
- `citizen.html` - Added map modal and initialization code
- `js/citizen.js` - Added station list setup and map launch functions

### Database Models:
Uses the existing `PollingStation` model with:
```javascript
{
    name: String,
    location: {
        address: String,
        latitude: Number,
        longitude: Number
    },
    capacity: Number,
    currentCrowdLevel: String (low/medium/high),
    votingHours: {
        startTime: String,
        endTime: String
    }
}
```

---

## How to Use

### For Citizens:

1. **View Map**
   - Click "View on Map" on the dashboard
   - See all nearby polling stations
   - Green = Short wait, Red = Long wait

2. **Check Station Details**
   - Click any marker on the map
   - See complete station information
   - View crowd level and hours
   - Decide best time to vote

3. **Report an Issue**
   - From station details, click "Report an Issue"
   - Pre-filled with station name
   - Submit your concern

### For Administrators:

1. **Update Crowd Levels**
   ```javascript
   // Update crowd level via API
   await stationAPI.updateCrowdLevel(stationId, 'high');
   ```

2. **Add New Stations**
   ```javascript
   // Create new station
   await stationAPI.create({
       name: "New Station",
       location: {
           address: "Address here",
           latitude: 28.6139,
           longitude: 77.2090
       },
       capacity: 500,
       votingHours: {
           startTime: "7:00 AM",
           endTime: "6:00 PM"
       }
   });
   ```

---

## API Integration

### Polling Map Class Methods

```javascript
// Initialize map
initializePollingMap({
    containerId: 'map-container',
    zoom: 12,
    center: { lat: 28.6139, lng: 77.2090 }
});

// Access the map instance
window.currentMapInstance

// Refresh data
window.currentMapInstance.refreshStationData();

// Stop auto-refresh
window.currentMapInstance.stopAutoRefresh();

// Start auto-refresh
window.currentMapInstance.startAutoRefresh();

// Show station details
window.currentMapInstance.showStationDetails(stationId);
```

---

## Data Flow

```
Citizen Opens Dashboard
         ↓
   Clicks "View on Map"
         ↓
   Map Modal Opens
         ↓
   Maps.js Initializes Google Map
         ↓
   API Request to /api/stations
         ↓
   MongoDB Returns Station Data
         ↓
   Markers Placed on Map
         ↓
   Auto-Refresh Every 30 Seconds
         ↓
   Citizen Clicks Marker
         ↓
   Info Window Shows Details
         ↓
   Citizen Can Click "Check Station"
         ↓
   Detailed Modal Opens
```

---

## Customization

### Change Auto-Refresh Interval
In `js/citizen.html`, find the map initialization:
```javascript
initializePollingMap({
    containerId: 'map-container',
    zoom: 12,
    center: { lat: 28.6139, lng: 77.2090 },
    refreshInterval: 60000  // Change to 60 seconds
});
```

### Change Map Zoom Level
```javascript
initializePollingMap({
    zoom: 15  // Default is 12, higher = more zoomed in
});
```

### Change Map Center
```javascript
initializePollingMap({
    center: { lat: YOUR_LAT, lng: YOUR_LNG }
});
```

### Change Colors
In `js/maps.js`, find the `getMarkerColor()` function:
```javascript
getMarkerColor(level) {
    const colors = {
        'low': '#10b981',    // Green
        'medium': '#f59e0b', // Amber
        'high': '#ef4444'    // Red
    };
    return colors[level] || colors['low'];
}
```

---

## Troubleshooting

### Map Not Loading
**Problem**: Map container shows but no map displays
**Solution**:
1. Verify API key is correct
2. Check browser console for errors
3. Ensure Maps JavaScript API is enabled in Google Cloud Console
4. Check CORS settings in API key configuration

### No Stations Appearing
**Problem**: Map loads but no station markers shown
**Solution**:
1. Check MongoDB connection
2. Verify stations have valid coordinates (latitude, longitude)
3. Check browser console for API errors
4. Try clicking "Refresh" button manually

### Auto-Refresh Not Working
**Problem**: Crowd levels not updating
**Solution**:
1. Check browser console for errors
2. Verify API is returning data
3. Try manual refresh with "Refresh" button
4. Check network tab for API requests

### API Key Errors
**Problem**: "InvalidKeyMapError" or similar
**Solution**:
1. Verify API key is correct in HTML
2. Enable Maps JavaScript API in Google Cloud
3. Check API key restrictions (should allow your domain)
4. Regenerate key if necessary

---

## Browser Compatibility

✅ **Supported Browsers**:
- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

⚠️ **Requirements**:
- Modern browser with ES6 support
- JavaScript enabled
- HTTPS (or localhost for development)

---

## Performance Tips

1. **Limit Station Count**: For 100+ stations, consider clustering
2. **Optimize Auto-Refresh**: Increase interval for better performance
3. **Cache Data**: Consider caching station data client-side
4. **Lazy Load Map**: Only initialize map when modal is opened (already implemented)

---

## Future Enhancements

- 📍 Marker clustering for many stations
- 🔍 Search and filter stations
- 📊 Show historical crowd level trends
- 🚗 Directions to nearest station
- 📱 Mobile-optimized map view
- 🎯 Geolocation to find nearest station
- 💬 Live chat support via map
- 📈 Crowd prediction/analytics

---

## Support

For issues or questions:
1. Check browser console (F12)
2. Review error messages in Network tab
3. Verify API key and database connection
4. Check MongoDB for valid station data
5. Test API endpoints with Postman

---

**Last Updated**: November 30, 2025
**Version**: 1.0
**Status**: Production Ready
