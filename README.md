# fakesharks 🦈

A fun web application to report and visualize fake shark attack incidents on an interactive map.

## Features

- **Interactive Map**: View all reported fake shark attacks on a Leaflet-based map
- **Right-Click Reporting**: Right-click anywhere on the map to start reporting an attack at that location
- **Report Form**: Submit detailed fake shark attack reports including:
	- Location (latitude/longitude)
	- Shark type (populated from database)
	- Body part affected (populated from database)
	- Severity level (1-5 scale)
	- Description (up to 160 characters)
- **Real-Time Updates**: Map refreshes automatically after submitting new reports

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Map Library**: Leaflet.js with OpenStreetMap tiles
- **Backend**: Flask (Python)
- **Database**: SQLite

## Getting Started

### Prerequisites

- Python 3.x
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fakesharks.git
cd fakesharks
```

2. Install dependencies with uv:
```bash
uv sync
```

3. Run the application:
```bash
uv run python app.py
```

4. Open your browser and navigate to:

```
http://localhost:5000
```

## Usage

1. **View Reports**: The map loads with all existing fake shark attack reports as markers
2. **Right-Click to Report**: Right-click anywhere on the map and select "Report Attack Here" to populate the latitude/longitude
3. **Fill Out the Form**: Complete the remaining fields (shark type, body part, severity, description)
4. **Submit**: Click "Submit Fake Attack" to add your report to the database and map

## Project Structure

```
fakesharks/
├── app.py                 # Flask backend and API routes
├── init_db.py            # Database initialization
├── static/
│   ├── app.js            # Frontend JavaScript logic
│   └── styles.css        # Styling
├── templates/
│   └── index.html        # Main HTML template
└── fakesharks.db         # SQLite database
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/reports` - Fetch all shark attack reports
- `POST /api/reports` - Submit a new shark attack report
- `GET /api/shark-types` - Fetch available shark types
- `GET /api/body-parts` - Fetch available body parts

## Future Improvements

- Enhanced popup styling to better highlight form population
- Additional report filtering and search capabilities
- User authentication and report history

## License

MIT
