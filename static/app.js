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


// Function to pre-fill the report form with latitude and longitude when user clicks "Report Attack Here" on the map
function reportAttackAt(lat, lon) {
  document.getElementById("lat").value = lat;
  document.getElementById("lon").value = lon;
  document.getElementById("lat").scrollIntoView({ behavior: "smooth" });
}


/**
 * Rewritten to use Leaflet for map rendering and marker management.
 * Fetches all reports from the API and displays them as markers on the map.
 * Each marker shows the shark type and body part in a popup when clicked.
 */
function refreshMap() {
  fetch("/api/reports")
    .then(res => res.json())
    .then(data => {
      // Remove existing map if it exists
      const mapContainer = document.getElementById("map");
      if (window.leafletMap) {
        window.leafletMap.remove();
      }
      
      // Initialize the map (center on world view, zoom level 2)
      // maxBounds restricts panning to a single copy of the world [-180, 180].
      // maxBoundsViscosity: 1 makes the boundary a hard stop (0 = rubberbands freely, 1 = no give).
      const map = L.map("map", {
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1,
        minZoom: 2.5,  // prevents zooming out far enough to see the world repeat; increase to 3 on wide screens
        zoomControl: false  // disable default +/- buttons; replaced by our custom ZoomControl below
      }).setView([20, 0], 2);
      window.leafletMap = map;  // Store globally so we can remove it next time

      // Custom vertical zoom control — replaces Leaflet's default +/- buttons.
      // Structure: [+] button, vertical track with fill bar, [−] button.
      // L.DomEvent.disableClickPropagation() is required so button clicks don't
      // also fire a map click event underneath the control.
      const ZoomControl = L.Control.extend({
        options: { position: "topleft" },
        onAdd(map) {
          const container = L.DomUtil.create("div", "zoom-control");
          container.innerHTML = `
            <button class="zoom-btn" id="zoom-in">+</button>
            <div class="zoom-track">
              <div class="zoom-track-fill" id="zoom-fill"></div>
            </div>
            <button class="zoom-btn" id="zoom-out">−</button>
          `;

          // Prevent clicks on the control from propagating to the map
          L.DomEvent.disableClickPropagation(container);

          // Wire buttons to Leaflet's built-in zoom methods
          container.querySelector("#zoom-in").addEventListener("click", () => map.zoomIn());
          container.querySelector("#zoom-out").addEventListener("click", () => map.zoomOut());

          return container;
        }
      });
      new ZoomControl().addTo(map);

      // Update the fill bar height whenever zoom changes.
      // Fill grows from the bottom: low zoom = short bar, high zoom = tall bar.
      function updateZoomBar() {
        const min = map.getMinZoom();  // 2.5
        const max = map.getMaxZoom();  // 19
        const pct = ((map.getZoom() - min) / (max - min)) * 100;
        document.getElementById("zoom-fill").style.height = pct + "%";
      }
      map.on("zoomend", updateZoomBar);
      updateZoomBar();  // set initial state

      // Add CartoDB Dark Matter tiles.
      // Purpose-built dark basemap — better contrast for colored icons than CSS-filtered OSM.
      // Free for non-commercial use; attribution required (included below).
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 13
      }).addTo(map);
      
      // Define the custom shark icon using the great-white SVG.
      // L.icon() describes an image-based marker icon.
      const sharkIcon = L.icon({
        iconUrl:     "/static/icons/great-white.svg",
        iconSize:    [38, 54],  // rendered pixel size; Leaflet scales the SVG to fit
        iconAnchor:  [19, 36],  // pixel offset (from top-left) that sits ON the map coordinate
                                //   x=19 → horizontal center of the 38px-wide image
                                //   y=36 → base of the triangle (~67% down the 54px-tall image)
        popupAnchor: [0, -18]   // where the popup opens, relative to iconAnchor; negative y = above
      });

      // Add markers for each report
      data.forEach(d => {
        L.marker([d.lat, d.lon], { icon: sharkIcon })
          .bindPopup(`Shark Type: <b>${d.shark_type}</b><br>Body Part: <b>${d.body_part}</b><br>Severity: ${d.severity}<br><br>Description: ${d.description}`)
          .addTo(map);
      });

      // Handle right-click to create attack report
      document.getElementById("map").addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const latlng = map.mouseEventToLatLng(e);
        const lat = latlng.lat.toFixed(4);
        const lon = latlng.lng.toFixed(4);
        
        L.popup()
          .setLatLng(latlng)
          .setContent(`
            <button onclick="reportAttackAt(${lat}, ${lon}); window.leafletMap.closePopup();" style="padding: 8px 12px; background-color: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Report Attack Here
            </button>
          `)
          .openOn(map);
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

