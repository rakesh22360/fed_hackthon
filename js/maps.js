/**
 * ===================================
 * Google Maps Integration Module
 * ===================================
 * Displays polling stations on a map with live crowd level updates
 */

class PollingStationMap {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.map = null;
        this.markers = [];
        this.infoWindows = [];
        this.refreshInterval = options.refreshInterval || 30000; // 30 seconds
        this.autoRefresh = options.autoRefresh !== false;
        this.selectedStationCallback = options.onStationSelected || null;
        this.defaultZoom = options.zoom || 12;
        this.defaultCenter = options.center || { lat: 28.6139, lng: 77.2090 }; // Delhi, India
    }

    /**
     * Initialize the map
     */
    async initMap() {
        try {
            console.log('Initializing polling station map...');
            
            // Create map element
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container ${this.containerId} not found`);
                return;
            }

            // Initialize Google Map
            this.map = new google.maps.Map(container, {
                zoom: this.defaultZoom,
                center: this.defaultCenter,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                styles: this.getMapStyles(),
            });

            // Load and display polling stations
            await this.loadPollingStations();
            
            // Setup auto-refresh
            if (this.autoRefresh) {
                this.startAutoRefresh();
            }

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showError('Failed to initialize map');
        }
    }

    /**
     * Load polling stations from API
     */
    async loadPollingStations() {
        try {
            const response = await stationAPI.getAll();
            
            if (response.success && response.data) {
                const stations = Array.isArray(response.data) ? response.data : 
                                response.data.stations || [];
                
                // Clear existing markers
                this.clearMarkers();
                
                // Add markers for each station
                stations.forEach(station => {
                    this.addStationMarker(station);
                });

                console.log(`Loaded ${stations.length} polling stations`);
            } else {
                // Fallback to mock data if API fails
                await this.loadMockStations();
            }
        } catch (error) {
            console.error('Error loading polling stations:', error);
            await this.loadMockStations();
        }
    }

    /**
     * Load mock polling stations
     */
    async loadMockStations() {
        try {
            const mockData = await loadMockData();
            const stations = mockData.pollingStations || [];
            
            // Add default coordinates if not present
            const mockStations = stations.map((station, index) => ({
                ...station,
                location: {
                    address: station.address || station.location,
                    latitude: station.latitude || (28.6 + index * 0.05),
                    longitude: station.longitude || (77.2 + index * 0.05)
                },
                currentCrowdLevel: station.currentCrowdLevel || this.getRandomCrowdLevel(),
                votingHours: station.votingHours || { startTime: '7:00 AM', endTime: '6:00 PM' }
            }));
            
            mockStations.forEach(station => this.addStationMarker(station));
        } catch (error) {
            console.error('Error loading mock stations:', error);
        }
    }

    /**
     * Add a polling station marker to the map
     * @param {Object} station - Station data
     */
    addStationMarker(station) {
        try {
            const lat = station.location?.latitude || station.latitude;
            const lng = station.location?.longitude || station.longitude;

            if (!lat || !lng) {
                console.warn(`Station ${station.name} has no coordinates`);
                return;
            }

            // Determine marker color based on crowd level
            const crowdLevel = station.currentCrowdLevel || 'low';
            const markerColor = this.getMarkerColor(crowdLevel);

            // Create marker
            const marker = new google.maps.Marker({
                position: { lat: parseFloat(lat), lng: parseFloat(lng) },
                map: this.map,
                title: station.name,
                icon: this.createMarkerIcon(markerColor),
                station: station
            });

            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: this.createInfoWindowContent(station)
            });

            // Add click listener
            marker.addListener('click', () => {
                this.closeAllInfoWindows();
                infoWindow.open(this.map, marker);
                
                // Trigger callback
                if (this.selectedStationCallback) {
                    this.selectedStationCallback(station);
                }
            });

            this.markers.push(marker);
            this.infoWindows.push(infoWindow);

        } catch (error) {
            console.error('Error adding station marker:', error);
        }
    }

    /**
     * Create custom marker icon
     * @param {string} color - Marker color
     * @returns {Object} Marker icon
     */
    createMarkerIcon(color) {
        return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
        };
    }

    /**
     * Create info window content
     * @param {Object} station - Station data
     * @returns {string} HTML content
     */
    createInfoWindowContent(station) {
        const crowdLevel = station.currentCrowdLevel || 'low';
        const crowdEmoji = this.getCrowdLevelEmoji(crowdLevel);
        const hours = station.votingHours || {};
        const startTime = hours.startTime || 'N/A';
        const endTime = hours.endTime || 'N/A';

        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; width: 250px; padding: 12px;">
                <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">
                    ${this.escapeHtml(station.name)}
                </h3>
                
                <div style="background: #f1f5f9; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
                    <div style="margin-bottom: 8px;">
                        <strong>📍 Location:</strong><br>
                        ${this.escapeHtml(station.location?.address || station.address || 'N/A')}
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>🕐 Voting Hours:</strong><br>
                        ${startTime} - ${endTime}
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>👥 Crowd Level:</strong> <span style="color: ${this.getCrowdLevelColor(crowdLevel)}; font-weight: bold;">
                            ${crowdEmoji} ${crowdLevel.toUpperCase()}
                        </span>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button onclick="window.currentMapInstance.showStationDetails('${station._id || station.id}')" 
                            style="flex: 1; padding: 8px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                        Check Station
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Get marker color based on crowd level
     * @param {string} level - Crowd level
     * @returns {string} Hex color
     */
    getMarkerColor(level) {
        const colors = {
            'low': '#10b981',    // Green
            'medium': '#f59e0b', // Amber
            'high': '#ef4444'    // Red
        };
        return colors[level] || colors['low'];
    }

    /**
     * Get crowd level color for display
     * @param {string} level - Crowd level
     * @returns {string} CSS color
     */
    getCrowdLevelColor(level) {
        const colors = {
            'low': '#10b981',
            'medium': '#f59e0b',
            'high': '#ef4444'
        };
        return colors[level] || '#666';
    }

    /**
     * Get crowd level emoji
     * @param {string} level - Crowd level
     * @returns {string} Emoji
     */
    getCrowdLevelEmoji(level) {
        const emojis = {
            'low': '😊',
            'medium': '😐',
            'high': '😟'
        };
        return emojis[level] || '?';
    }

    /**
     * Get random crowd level for mock data
     * @returns {string} Crowd level
     */
    getRandomCrowdLevel() {
        const levels = ['low', 'medium', 'high'];
        return levels[Math.floor(Math.random() * levels.length)];
    }

    /**
     * Get custom map styles
     * @returns {Array} Google Maps styles
     */
    getMapStyles() {
        return [
            {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                stylers: [{ visibility: 'on' }]
            }
        ];
    }

    /**
     * Close all info windows
     */
    closeAllInfoWindows() {
        this.infoWindows.forEach(iw => iw.close());
    }

    /**
     * Clear all markers from map
     */
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        this.infoWindows = [];
    }

    /**
     * Show station details in a modal or card
     * @param {string} stationId - Station ID
     */
    async showStationDetails(stationId) {
        try {
            // Find station in markers
            const markerWithStation = this.markers.find(m => 
                m.station && (m.station._id === stationId || m.station.id === stationId)
            );

            if (!markerWithStation) {
                this.showError('Station not found');
                return;
            }

            const station = markerWithStation.station;
            
            // Create or update modal
            const modalId = 'stationDetailsModal';
            let modal = document.getElementById(modalId);
            
            if (!modal) {
                modal = document.createElement('div');
                modal.id = modalId;
                modal.className = 'modal';
                document.body.appendChild(modal);
            }

            modal.innerHTML = this.createStationDetailsContent(station);
            modal.classList.add('active');

            // Close button handler
            document.querySelector(`#${modalId} .modal-close`)?.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        } catch (error) {
            console.error('Error showing station details:', error);
            this.showError('Failed to load station details');
        }
    }

    /**
     * Create station details modal content
     * @param {Object} station - Station data
     * @returns {string} HTML content
     */
    createStationDetailsContent(station) {
        const crowdLevel = station.currentCrowdLevel || 'low';
        const crowdEmoji = this.getCrowdLevelEmoji(crowdLevel);
        const crowdColor = this.getCrowdLevelColor(crowdLevel);
        const hours = station.votingHours || {};

        return `
            <div class="modal-content" style="max-width: 600px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 class="modal-title" style="margin: 0;">Polling Station Details</h2>
                    <button class="modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
                </div>

                <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05)); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 20px;">
                        📍 ${this.escapeHtml(station.name)}
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Location</label>
                            <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 500;">
                                ${this.escapeHtml(station.location?.address || station.address || 'N/A')}
                            </p>
                        </div>

                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Coordinates</label>
                            <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 500;">
                                ${(station.location?.latitude || 'N/A').toFixed(4)}, ${(station.location?.longitude || 'N/A').toFixed(4)}
                            </p>
                        </div>

                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Voting Hours</label>
                            <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 500;">
                                🕐 ${hours.startTime || 'N/A'} - ${hours.endTime || 'N/A'}
                            </p>
                        </div>

                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Capacity</label>
                            <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 500;">
                                👥 ${station.capacity || 'N/A'} voters
                            </p>
                        </div>

                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Status</label>
                            <p style="margin: 4px 0 0 0; color: #10b981; font-weight: 500;">
                                ✓ ${station.isOpen !== false ? 'Open' : 'Closed'}
                            </p>
                        </div>

                        <div>
                            <label style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Contact</label>
                            <p style="margin: 4px 0 0 0; color: #1e293b; font-weight: 500;">
                                📞 ${station.contactNumber || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div style="background: ${crowdColor}15; border-left: 4px solid ${crowdColor}; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 32px;">${crowdEmoji}</span>
                        <div>
                            <h4 style="margin: 0 0 4px 0; color: ${crowdColor}; font-size: 16px;">Current Crowd Level</h4>
                            <p style="margin: 0; color: ${crowdColor}; font-weight: bold; font-size: 18px;">
                                ${crowdLevel.toUpperCase()}
                            </p>
                            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px;">
                                Updated ${this.getLastUpdated()}
                            </p>
                        </div>
                    </div>
                </div>

                <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; color: #1e293b;">What This Means:</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px;">
                        <li style="margin-bottom: 8px;">
                            <strong style="color: #1e293b;">Low crowd:</strong> Short waiting times expected, minimal delays
                        </li>
                        <li style="margin-bottom: 8px;">
                            <strong style="color: #1e293b;">Medium crowd:</strong> Moderate wait times, station handling well
                        </li>
                        <li style="margin-bottom: 0;">
                            <strong style="color: #1e293b;">High crowd:</strong> Long queues expected, bring patience or visit off-peak hours
                        </li>
                    </ul>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('stationDetailsModal').classList.remove('active')">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="window.currentMapInstance.reportIssueForStation('${station._id || station.id}')">
                        Report an Issue
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Report an issue for a station
     * @param {string} stationId - Station ID
     */
    reportIssueForStation(stationId) {
        const stationMarker = this.markers.find(m => 
            m.station && (m.station._id === stationId || m.station.id === stationId)
        );

        if (stationMarker) {
            const stationName = stationMarker.station.name;
            
            // Close current modal
            document.getElementById('stationDetailsModal')?.classList.remove('active');
            
            // Pre-fill and open report modal
            const reportModal = document.getElementById('reportModal');
            if (reportModal) {
                document.getElementById('report-station').value = stationName;
                reportModal.classList.add('active');
            }
        }
    }

    /**
     * Refresh station data from API
     */
    async refreshStationData() {
        try {
            await this.loadPollingStations();
        } catch (error) {
            console.error('Error refreshing station data:', error);
        }
    }

    /**
     * Start auto-refresh interval
     */
    startAutoRefresh() {
        this.refreshIntervalId = setInterval(() => {
            this.refreshStationData();
        }, this.refreshInterval);

        console.log(`Auto-refresh started (${this.refreshInterval}ms)`);
    }

    /**
     * Stop auto-refresh interval
     */
    stopAutoRefresh() {
        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
            console.log('Auto-refresh stopped');
        }
    }

    /**
     * Get last updated timestamp
     * @returns {string} Formatted time
     */
    getLastUpdated() {
        return new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error(message);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px 20px;
            border-radius: 6px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
        `;
        errorDiv.textContent = '❌ ' + message;
        document.body.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 4000);
    }

    /**
     * Destroy map instance
     */
    destroy() {
        this.stopAutoRefresh();
        this.clearMarkers();
        if (this.map) {
            this.map = null;
        }
    }
}

// Global reference for window callbacks
let currentMapInstance = null;

/**
 * Initialize map on page load
 * @param {Object} options - Map options
 */
function initializePollingMap(options = {}) {
    try {
        // Check if Google Maps is loaded
        if (typeof google === 'undefined' || !google.maps) {
            console.error('Google Maps API is not loaded');
            return;
        }

        // Create map instance
        const containerId = options.containerId || 'map-container';
        currentMapInstance = new PollingStationMap(containerId, {
            refreshInterval: 30000,
            autoRefresh: true,
            onStationSelected: options.onStationSelected,
            zoom: options.zoom || 12,
            center: options.center || { lat: 28.6139, lng: 77.2090 }
        });

        // Initialize map
        currentMapInstance.initMap();

        window.currentMapInstance = currentMapInstance;
    } catch (error) {
        console.error('Error initializing polling map:', error);
    }
}
