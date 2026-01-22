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

  
document.getElementById("report-form").onsubmit = e => {
  e.preventDefault();

  fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lat: 42,
      lon: -71,
      severity: 5,
      shark_type: "Land Shark",
      activity: "Deploying Flask app",
      description: "Unexpected snacking incident"
    })
  }).then(() => location.reload());
};

