# Simple code to initiate the database
import sqlite3
import os

def init_db(db_name: str = None):

    # Assign default database name if argument is specified
    if db_name is None:
        db_name = "fakesharks.db"

    # Check if database already exists
    if os.path.exists(db_name):
        print("Database already exists. Skipping initialization.")
        return
    
    # Otherwise we'll create a new database
    conn = sqlite3.connect(db_name)

    # Now create the fake shark attack reports table
    conn.execute(
        """
        CREATE TABLE reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            lat REAL NOT NULL,
            lon REAL NOT NULL,
            shark_type TEXT NOT NULL,
            body_part TEXT NOT NULL,
            severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5),
            description TEXT NOT NULL CHECK (LENGTH(description) <= 160),
            long_description TEXT NULL,
            survived BOOLEAN NOT NULL
        )
        """)

    print("Storage database created successfully...")


    # Now create definition tables for shark types and body parts allowed
    # Populate in one step, but plan on breaking into a new function

    # Create the shark types table
    conn.execute("""
        CREATE TABLE t_shark_types (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shark_type TEXT UNIQUE NOT NULL
            )
        """)
    
    # Create the body parts table 
    conn.execute("""
        CREATE TABLE t_body_parts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            body_part TEXT UNIQUE NOT NULL
            )
        """)
    
    print("Definition tables created successfully...")

    # Populate the lookup tables with data
    refresh_lookup_tables(db_name)

    conn.commit()
    conn.close()



def refresh_lookup_tables(db_name: str = None):
    """
    Docstring for refresh_lookup_tables
    
    :param db_name: Description
    :type db_name: str

    Update the lookup tables for shark type and body parts
    """
    # Assign default database name if argument is specified
    if db_name is None:
        db_name = "fakesharks.db"

    conn = sqlite3.connect(db_name)

    # Clear existing entries
    conn.execute("DELETE FROM t_shark_types")
    conn.execute("DELETE FROM t_body_parts")

    # Re-populate the tables
    # NOTE: For now, this is the master list of shark types and body parts
    shark_types = ["Great White", "Tiger Shark", "Mako"]
    body_parts = ['Head', 'Arm', 'Legs', "Torso", "Multiple"]

    for shark in shark_types:
        conn.execute(f"INSERT INTO t_shark_types (shark_type) values('{shark}')")
    print("Those pesky sharks are added to the database...")

    for part in body_parts:
        conn.execute(f"INSERT INTO t_body_parts (body_part) values('{part}')")
    print("Delicious body parts added to the menu/database...")

    conn.commit()
    conn.close()
    print("Lookup tables refreshed successfully.")









if __name__ == "__main__":
    init_db()