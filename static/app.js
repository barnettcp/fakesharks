fetch("/api/reports")
  .then(res => res.json())
  .then(data => {
    Plotly.newPlot("map", [{
      type: "scattergeo",
      lat: data.map(d => d.lat),
      lon: data.map(d => d.lon),
      text: data.map(d => d.shark_type),
      mode: "markers",
      marker: { size: 10 }
    }], {
      geo: { scope: "world" }
    });
  });

document.getElementById("report-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  const shark_type = document.querySelector('input[placeholder="Shark Type"]').value;
  
  // Send POST request to backend
  fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon, shark_type })
  }).then(() => {
    // Refresh the map with new data
  });
});

