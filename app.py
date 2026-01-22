from flask import Flask, request, jsonify, render_template
import sqlite3
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

def get_db():
    return sqlite3.connect("database.db")

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
            "severity": r[4],
            "shark_type": r[5],
            "activity": r[6],
            "description": r[7]
        }
        for r in rows
    ]

    return jsonify(reports)

@app.route("/api/reports", methods=["POST"])
def add_report():
    data = request.json
    conn = get_db()
    conn.execute(
        """
        INSERT INTO reports
        (timestamp, lat, lon, severity, shark_type, activity, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            datetime.utcnow(),
            data["lat"],
            data["lon"],
            data["severity"],
            data["shark_type"],
            data["activity"],
            data["description"],
        )
    )
    conn.commit()
    conn.close()
    return jsonify({"status": "success"})

