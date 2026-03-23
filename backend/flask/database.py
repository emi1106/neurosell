import sqlite3
from pathlib import Path
from datetime import datetime

# Database path - stored in the backend root directory
DB_PATH = Path(__file__).parent.parent / "listings.db"

def get_db_connection():
    """Get a connection to the SQLite database."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def init_db():
    """Initialize the database with tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create listings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            brand TEXT,
            size TEXT,
            color TEXT,
            condition TEXT,
            category TEXT NOT NULL,
            predicted_label INTEGER,
            confidence REAL,
            recommended_price REAL,
            description TEXT,
            image_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create index for user_id for faster queries
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_user_id ON listings(user_id)
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
