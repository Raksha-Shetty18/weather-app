// ===================================
// WeatherNow
// Map Module
// ===================================

// Create Map
let map = L.map("map").setView([20.5937, 78.9629], 4);

// OpenStreetMap Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Marker
let marker = L.marker([20.5937, 78.9629]).addTo(map);

// Update Map
function updateMap(lat, lon, city) {

    map.setView([lat, lon], 10);

    marker.setLatLng([lat, lon]);

    marker.bindPopup(`<b>${city}</b>`).openPopup();

}