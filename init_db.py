# Simple code to initiate the database
import sqlite3
import os

def init_db(db_name: str = None):

    if db_name is None:
        db_name = "database.db"

    # Check if database already exists
    if os.path.exists(db_name):
        print("Database already exists. Skipping initialization.")
        return
    
    # Otherwise we'll create a new database
    conn = sqlite3.connect(db_name)
    conn.execute(
        """
        CREATE TABLE reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            shark_type TEXT NOT NULL,
            body_part TEXT NOT NULL,
            description TEXT NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()
    print("Database created successfully")

if __name__ == "__main__":
    init_db()