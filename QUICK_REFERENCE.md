# 🎯 Election Monitoring System - Quick Reference Guide

## 📋 One-Page Cheat Sheet

### 🚀 GET STARTED IN 30 SECONDS
```
1. Open: c:\Users\RAKESH\OneDrive\Documents\fed_project\election-monitoring
2. Double-click: index.html
3. Explore the app!
```

---

## 🏠 LANDING PAGE (index.html)
| Feature | Action |
|---------|--------|
| **Admin** | View polling stations, manage config |
| **Citizen** | Report issues, view election info |
| **Observer** | Log observations, track compliance |
| **Analyst** | Analyze data, generate reports |

---

## 👨‍💼 ADMIN DASHBOARD

### Statistics
- Total Polling Stations
- Registered Voters
- Active Issues
- System Status

### Actions
- View stations table
- Configure election settings
- Save configuration
- Refresh data

### Data Stored
- `admin_config` (localStorage)

---

## 👤 CITIZEN DASHBOARD

### Report Issues With
- Title (required)
- Category: Queue, Machine, Staff, Security, Accessibility, Other
- Severity: Low, Medium, High
- Polling Station (required)
- Detailed Description (required)
- Anonymous checkbox

### Features
- Submit reports
- View report history
- Delete reports
- See election info
- Find polling stations

### Data Stored
- `citizen_issues` (localStorage)

---

## 👁️ OBSERVER DASHBOARD

### Log Observations With
- Title (required)
- Station (required)
- Time (required)
- Type: Queue, Procedure, Equipment, Staff, Security, Incident
- Details (required)
- Severity: No Issue, Minor, Moderate, Serious

### Features
- Log observations
- View monitoring table
- Track compliance
- Count incidents
- Calculate compliance rate

### Data Stored
- `observer_observations` (localStorage)

---

## 📊 ANALYST DASHBOARD

### Analyze
- Statistics (votes, time, turnout, anomalies)
- Analytics table
- Key insights
- Anomaly detection

### Generate Reports
- Report type: Summary, Detailed, Anomaly, Trend
- Include recommendations option
- CSV export

### Data Stored
- `analyst_reports` (localStorage)

---

## 🎨 CUSTOMIZATION QUICK TIPS

### Change Colors
Edit: `css/style.css`
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --success-color: #16a34a;
    --warning-color: #ea580c;
    --danger-color: #dc2626;
}
```

### Change Election Name
Edit: `data/mock-data.json`
```json
"election": {
    "name": "Your Election Name"
}
```

### Add Issue Category
Edit: `citizen.html`
Find `<select id="report-category">` and add option:
```html
<option value="new-id">New Category</option>
```

---

## 💾 DATA MANAGEMENT

### View Stored Data
```javascript
// In browser console (F12):
console.log(localStorage);
```

### View Specific Data
```javascript
JSON.parse(localStorage.getItem('citizen_issues'))
JSON.parse(localStorage.getItem('observer_observations'))
JSON.parse(localStorage.getItem('admin_config'))
```

### Clear All Data
```javascript
localStorage.clear();
```

### Export Data
- Click "Export Report" button in dashboards
- CSV file downloads automatically

---

## 🧪 TESTING QUICK CHECKLIST

### Landing Page
- [ ] Page loads
- [ ] 4 role buttons visible
- [ ] Buttons are clickable
- [ ] Navigation works

### Each Dashboard
- [ ] Page loads
- [ ] Statistics display
- [ ] Forms visible
- [ ] Navigation works

### Form Submission
- [ ] Fill required fields
- [ ] Click submit
- [ ] Success message appears
- [ ] Data appears in list

### Data Persistence
- [ ] Submit data
- [ ] Refresh page (F5)
- [ ] Data still visible
- [ ] Count updates

### Mobile Testing (F12 → Device Toolbar)
- [ ] Single column on mobile
- [ ] Forms readable
- [ ] Buttons clickable
- [ ] Tables scrollable

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Page won't load | Double-click index.html |
| Styles broken | Clear cache (Ctrl+Shift+Delete) |
| Data not saving | Check localStorage enabled |
| Console errors | See F12 → Console tab |
| Forms not working | Fill all required fields (marked *) |
| Mobile looks wrong | Test with F12 Device Toolbar |
| Can't find files | Check election-monitoring folder |
| CSV export empty | Add data first before exporting |

---

## 📱 RESPONSIVE BREAKPOINTS

| Size | Devices |
|------|---------|
| 480px | Mobile phones |
| 768px | Tablets |
| 1024px | Desktops |
| 1400px | Large screens |

---

## 📚 FILES AT A GLANCE

| File | Purpose |
|------|---------|
| index.html | Landing page |
| admin.html | Admin dashboard |
| citizen.html | Citizen dashboard |
| observer.html | Observer dashboard |
| analyst.html | Analyst dashboard |
| css/style.css | All styling |
| js/main.js | Shared functions |
| js/admin.js | Admin logic |
| js/citizen.js | Citizen logic |
| js/observer.js | Observer logic |
| js/analyst.js | Analyst logic |
| data/mock-data.json | Sample data |
| assets/logo.png | Logo image |

---

## 🔗 KEY FUNCTIONS

### Navigation
```javascript
navigateToRole('admin')     // Go to admin page
navigateToRole('citizen')   // Go to citizen page
```

### Data
```javascript
saveToLocalStorage(key, data)    // Save data
loadFromLocalStorage(key)        // Load data
loadMockData()                   // Load mock data
```

### UI
```javascript
showNotification(msg, type)      // Show alert
formatDate(dateString)           // Format date
downloadCSV(csv, filename)       // Export CSV
```

---

## ✅ QUICK START PATHS

### Path 1: See It (5 min)
1. Open index.html
2. Click a role
3. Explore dashboard

### Path 2: Use It (15 min)
1. Open index.html
2. Go to Citizen page
3. Submit a report
4. Refresh to verify

### Path 3: Learn It (1 hour)
1. Read README.md
2. Open code files
3. Study HTML structure
4. Review CSS styles
5. Study JavaScript

### Path 4: Test It (2-3 hours)
1. Follow TESTING.md
2. Test all pages
3. Test on mobile
4. Test browsers
5. Verify features

---

## 🎯 KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| F12 | Open DevTools |
| Ctrl+Shift+Delete | Clear cache |
| F5 | Refresh page |
| Ctrl+Shift+I | Inspect element |
| Ctrl+K | Search in DevTools |

---

## 📊 MOCK DATA STRUCTURE

```json
{
  "election": {
    "name": "General Election 2025",
    "date": "2025-12-15",
    "status": "Planning"
  },
  "pollingStations": [
    {
      "id": "PS001",
      "name": "Central High School",
      "location": "Downtown",
      "capacity": 500
    }
  ],
  "candidates": [
    {
      "id": "cand_001",
      "name": "John Smith",
      "party": "Democratic Party"
    }
  ]
}
```

---

## 🔒 SECURITY FEATURES

- ✅ Input validation on forms
- ✅ HTML escaping for display
- ✅ No XSS vulnerabilities
- ✅ Local data only (no server)
- ✅ Optional anonymous reports

---

## 💡 PRO TIPS

1. **Live Reload**: Use VS Code Live Server
2. **Mobile Testing**: F12 → Device Toolbar
3. **Console**: Keep F12 open while developing
4. **LocalStorage**: Check Application tab
5. **Responsive**: Always test on mobile
6. **Export**: Download data as CSV
7. **Colors**: Use CSS variables
8. **Backup**: Export data before clearing

---

## 📞 NEED HELP?

| Question | Answer |
|----------|--------|
| How do I start? | Open index.html |
| Where's documentation? | Read README.md |
| How do I test? | Follow TESTING.md |
| What are all features? | Check FEATURES.md |
| How do I customize? | Edit CSS and JS |
| How do I deploy? | Upload to server |
| Where's my data? | Check F12 → Application |
| Can I export data? | Click Export button |

---

## 🎉 YOU'RE READY!

**Start with**: Open `index.html`

**Need more help?** Read `README.md`

**Want quick start?** Follow `QUICKSTART.md`

**Ready to test?** Check `TESTING.md`

---

**Version**: 1.0
**Status**: Ready ✅
**Location**: `election-monitoring` folder
