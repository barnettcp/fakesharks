from flask import Flask, request, jsonify, render_template
import sqlite3
import random
from datetime import datetime
from init_db import init_db

app = Flask(__name__)

# Initialize the database if it doesn't exist
init_db()


@app.route("/")
def index():
    return render_template("index.html")


# Function to connect to the database
def get_db(name: str = None):

    # Assign default database name if argument is specified
    if name is None:
        name = "fakesharks.db"

    return sqlite3.connect(name)


# Fetch a record of shark reports
@app.route("/api/reports", methods=["GET"])
def get_reports():
    conn = get_db()
    rows = conn.execute("SELECT * FROM reports").fetchall()
    conn.close()

    reports = [
        {
            "id": r[0],
            "timestamp": r[1],
            "lat": r[2],
            "lon": r[3],
            "shark_type": r[4],
            "body_part": r[5],
            "severity": r[6],
            "description": r[7],
            "long_description": r[8],
            "survived": r[9]
        }
        for r in rows
    ]

    return jsonify(reports)

def calculate_survival(data: dict) -> bool:
    """
    Determine whether the victim survived the shark attack.

    Currently uses a simple random threshold: a random float in [0, 1) is
    generated and compared against SURVIVAL_RATE.  If the value falls below
    the threshold the victim survives.

    This function is intentionally isolated so that more sophisticated logic
    (e.g. weighting by severity or shark type) can be introduced here later
    without touching the rest of the request handler.

    Args:
        data: The raw POST payload for a new report.  Included now so the
              signature is already correct when input-based logic is added.

    Returns:
        True if the victim survived, False otherwise.
    """
    # Threshold for survival: values below this produce a True (survived) result.
    # Raise or lower this constant to tune the overall survival rate.
    SURVIVAL_RATE = 0.6

    return random.random() < SURVIVAL_RATE


@app.route("/api/reports", methods=["POST"])
def add_report():
    data = request.json
    conn = get_db()

    # Determine survival outcome via dedicated function so the logic can be
    # expanded independently of this request handler.
    survived = calculate_survival(data)

    # Add the new report to the database
    conn.execute(
        """
        INSERT INTO reports
        (timestamp, lat, lon, shark_type, body_part, severity, description, long_description, survived)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            datetime.utcnow(),
            data["lat"],
            data["lon"],
            data["shark_type"],
            data["body_part"],
            data["severity"],
            data["description"],
            None,  # long_description will be populated later
            survived,
        )
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})




# Fetch shark types from the database
@app.route("/api/shark-types")
def get_shark_types():
    conn = get_db()         # Default database connection
    types = conn.execute("SELECT shark_type FROM t_shark_types ORDER BY shark_type").fetchall()
    conn.close()
    return jsonify([t[0] for t in types])

# Fetch body parts from the database
@app.route("/api/body-parts")
def get_body_parts():
    conn = get_db()
    parts = conn.execute("SELECT body_part FROM t_body_parts ORDER BY body_part").fetchall()
    conn.close()
    return jsonify([p[0] for p in parts])