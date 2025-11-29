# 🔑 Google Maps API Key - Quick Setup Guide

## Get Your Free Google Maps API Key in 5 Minutes

### Step 1: Go to Google Cloud Console
```
URL: https://console.cloud.google.com/
```

### Step 2: Create a New Project
1. Click the **project dropdown** at the top left
2. Click **NEW PROJECT**
3. Enter a project name: `Election Monitoring System`
4. Click **CREATE**
5. Wait for the project to be created (1-2 minutes)

### Step 3: Enable Maps API
1. In the search bar, type: `Maps JavaScript API`
2. Click **Maps JavaScript API** from results
3. Click **ENABLE**

### Step 4: Create API Key
1. Go to **Credentials** (left sidebar)
2. Click **CREATE CREDENTIALS**
3. Select **API Key**
4. Copy the API key that appears
5. Click **RESTRICT KEY** to secure it

### Step 5: Configure API Key Restrictions
1. **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   
2. **Website restrictions** - Add these:
   ```
   localhost/*
   http://localhost:8000/*
   http://127.0.0.1:8000/*
   ```

3. **API restrictions** - Select:
   - Maps JavaScript API
   - (Optional) Maps Static API, Maps Embed API

4. Click **SAVE**

### Step 6: Add to Your Code
In `citizen.html`, find this line:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=marker"></script>
```

Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&libraries=marker"></script>
```

---

## ✅ Verification Checklist

- ✅ Copied API Key from Google Console
- ✅ Updated `citizen.html` with API key
- ✅ Added restriction: `localhost/*`
- ✅ Selected Maps JavaScript API
- ✅ Saved and activated

---

## 🧪 Test It Works

1. **Start the backend server**
   ```bash
   cd election-monitoring
   node server/server.js
   ```
   Expected: "MongoDB connected" message

2. **Start the frontend server** (in another terminal)
   ```bash
   cd election-monitoring
   python -m http.server 8000
   ```
   Expected: "Serving HTTP..." message

3. **Open your browser**
   ```
   URL: http://localhost:8000/citizen.html
   ```

4. **Login** (use any test account)

5. **Click "View on Map"**
   - Should see a map load
   - Should see polling station markers
   - Should see a legend with colors

6. **Click a marker**
   - Info window should appear
   - Should show station details
   - Should show crowd level

If everything loads, you're all set! ✅

---

## 🐛 Common Issues & Fixes

### "Maps API not loaded"
**Problem**: Map doesn't load, browser console shows error
**Fix**:
1. Verify API key is correct (no typos)
2. Wait 1-2 minutes for API to activate
3. Check API key restrictions (add localhost)
4. Regenerate API key if needed

### "Invalid API Key"
**Problem**: Error message about invalid API key
**Fix**:
1. Copy the exact key from Google Console (no spaces)
2. Ensure it's in correct format: `AIzaSy...`
3. Verify Maps JavaScript API is enabled
4. Check that the key hasn't expired

### "RefusedToConnect"
**Problem**: Browser shows connection refused
**Fix**:
1. Ensure backend server is running
2. Check backend is on port 5000
3. Verify MongoDB is connected
4. Check no firewall blocking localhost

### "Stations not appearing on map"
**Problem**: Map loads but no markers
**Fix**:
1. Verify database has polling stations
2. Check stations have valid coordinates
3. Ensure latitude is -90 to 90
4. Ensure longitude is -180 to 180

---

## 🔐 Security Best Practices

### For Development:
```
✅ Use localhost restrictions
✅ Use temporary API keys
✅ Never commit keys to git
```

### For Production:
```
✅ Restrict to your domain only
✅ Add IP restrictions if possible
✅ Use environment variables
✅ Rotate keys periodically
✅ Monitor usage in Google Console
✅ Set up billing alerts
```

### Protect Your Key:
1. **Never share** your API key publicly
2. **Don't hardcode** in github (use environment variables)
3. **Restrict** to your domain
4. **Monitor** usage in Google Console
5. **Rotate** periodically

---

## 💰 Pricing Information

**Good news**: Maps JavaScript API includes:
- ✅ **$7/month** free credit (usually covers small projects)
- ✅ **No credit card** required for free tier
- ✅ **$1-7 per 1,000 loads** after free credit
- ✅ Check [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing/)

For election monitoring system:
- Small deployment: **Free** (under $7/month)
- Medium deployment: **$20-50/month**
- Large deployment: **Custom pricing**

---

## 📞 API Key Details

Your API key will look like:
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Never share this key!** Treat it like a password.

If compromised:
1. Go to Google Console
2. Delete the old key
3. Generate a new one
4. Update your code
5. Restart your application

---

## ✨ Next Steps

1. ✅ Get your API key (5 minutes)
2. ✅ Add it to `citizen.html`
3. ✅ Test the map loads
4. ✅ Add polling stations with coordinates
5. ✅ Update crowd levels
6. ✅ Show to your users!

---

## 🎯 Ready to Go?

Once you have:
1. ✅ Google Maps API key
2. ✅ Added to citizen.html
3. ✅ Backend running on port 5000
4. ✅ Frontend running on port 8000
5. ✅ Polling stations in MongoDB

**Your map will work perfectly!**

Test it now: `http://localhost:8000/citizen.html`

---

**Questions?** Check the full setup guide:
- 📖 `GOOGLE_MAPS_INTEGRATION.md` - Complete setup and customization
- 📋 `GOOGLE_MAPS_FEATURE_SUMMARY.md` - Features and usage

**Last Updated**: November 30, 2025
