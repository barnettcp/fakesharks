/**
 * Populates dropdown menus with shark types and body parts from the API.
 * Called on page load to ensure form dropdowns are ready for user input.
 */
function populateDropdowns() {

  // Fetch shark types from the API
  fetch("/api/shark-types")
    // Convert response to JSON
    .then(res => res.json())
    // Receive the array of shark types
    .then(types => {
      // Get the shark-type select element
      const select = document.getElementById("shark-type");
      // Loop through each shark type
      types.forEach(type => {
        // Create a new option element
        const option = document.createElement("option");
        // Set the value attribute
        option.value = type;
        // Set the displayed text
        option.textContent = type;
        // Add the option to the select dropdown
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error loading shark types:", err));

    // Fetch body parts from the API and populate the body-part dropdown (same pattern as shark types)
    fetch("/api/body-parts")
      .then(res => res.json())
      .then(parts => {
        const select = document.getElementById("body-part");
        parts.forEach(part => {
          const option = document.createElement("option");
          option.value = part;
          option.textContent = part;
          select.appendChild(option);
        });
      })
      .catch(err => console.error("Error loading body parts:", err));
}

// Initialize dropdown menus when page loads
populateDropdowns();


/**
 * Rewritten to use Leaflet for map rendering and marker management.
 * Fetches all reports from the API and displays them as markers on the map.
 * Each marker shows the shark type and body part in a popup when clicked.
 */
function refreshMap() {
  fetch("/api/reports")
    .then(res => res.json())
    .then(data => {
      // Initialize the map (center on world view, zoom level 2)
      const map = L.map("map").setView([20, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);
      
      // Add markers for each report
      data.forEach(d => {
        L.marker([d.lat, d.lon])
          .bindPopup(`Shark Type: <b>${d.shark_type}</b><br>Body Part: <b>${d.body_part}</b><br>Severity: ${d.severity}<br><br>Description: ${d.description}`)
          .addTo(map);
      });
    })
    .catch(err => console.error("Error loading reports:", err));
}

// Render map with existing reports on page load
refreshMap();


/**
 * Handle form submission for new fake shark attack reports.
 * Collects form data, submits to backend, and refreshes the map.
 */
document.getElementById("report-form").addEventListener("submit", (e) => {
  // Prevent default form submission and page reload
  e.preventDefault();

  // Collect all form values from the user input
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  const shark_type = document.getElementById("shark-type").value;
  const body_part = document.getElementById("body-part").value;
  const severity = document.getElementById("severity").value;
  const description = document.getElementById("description").value;

  // Send form data to backend API
  fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lat: lat,
      lon: lon,
      shark_type: shark_type,
      body_part: body_part,
      severity: severity,
      description: description
    })
  })
    .then(res => res.json())
    .then(() => {
      // Clear form fields for next entry
      document.getElementById("report-form").reset();
      // Refresh map to display the new report
      refreshMap();
      console.log("Report submitted successfully");
    })
    .catch(err => console.error("Error submitting report:", err));
});

