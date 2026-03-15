# fakesharks 🦈

A fun web application to report and visualize fake shark attack incidents on an interactive map. Each submitted report is automatically turned into a sarcastic news article by an LLM.

## Features

- **Interactive Map**: View all reported fake shark attacks on a Leaflet-based map
- **Right-Click Reporting**: Right-click anywhere on the map to start reporting an attack at that location
- **Report Form**: Submit detailed fake shark attack reports including:
	- Location (latitude/longitude)
	- Shark type (populated from database)
	- Body part affected (populated from database)
	- Severity level (1-5 scale)
	- Description (up to 160 characters)
- **AI-Generated Articles**: Each report triggers an LLM call (via HuggingFace) that writes a short, sarcastic news article stored alongside the report
- **Real-Time Updates**: Map refreshes automatically after submitting new reports

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Map Library**: Leaflet.js with CartoDB Dark Matter tiles
- **Backend**: Flask (Python)
- **Database**: SQLite
- **LLM Integration**: LangChain + HuggingFace Inference API (`Qwen/Qwen2.5-7B-Instruct`)

## Getting Started

### Prerequisites

- Python 3.x
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- A [HuggingFace API token](https://huggingface.co/settings/tokens)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/barnettcp/fakesharks.git
cd fakesharks
```

2. Install dependencies with uv:
```bash
uv sync
```

3. Create a `.env` file in the project root with your HuggingFace token:
```
HUGGINGFACEHUB_API_TOKEN=your_token_here
```

4. Run the application:
```bash
uv run python app.py
```

5. Open your browser and navigate to:

```
http://localhost:5000
```

## Usage

1. **View Reports**: The map loads with all existing fake shark attack reports as markers
2. **Right-Click to Report**: Right-click anywhere on the map and select "Report Attack Here" to populate the latitude/longitude
3. **Fill Out the Form**: Complete the remaining fields (shark type, body part, severity, description)
4. **Submit**: Click "Submit Fake Attack" to add your report — an AI-generated article will be written and stored automatically

## Project Structure

```
fakesharks/
├── app.py                 # Flask backend and API routes
├── llm.py                 # LangChain chain setup and generate_article()
├── init_db.py             # Database initialization
├── prompts/
│   └── article_system_prompt.txt  # System prompt for the LLM
├── static/
│   ├── app.js             # Frontend JavaScript logic
│   └── styles.css         # Styling
├── templates/
│   └── index.html         # Main HTML template
└── fakesharks.db          # SQLite database
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/reports` - Fetch all shark attack reports
- `POST /api/reports` - Submit a new shark attack report (triggers LLM article generation)
- `GET /api/shark-types` - Fetch available shark types
- `GET /api/body-parts` - Fetch available body parts

## Future Improvements

- Display the generated article on marker click/hover
- Enhanced popup styling to better highlight form population
- Additional report filtering and search capabilities
- User authentication and report history

## License

MIT
