from database import get_db_connection
from datetime import datetime

class Listing:
    """Database model for listings."""
    
    @staticmethod
    def create(user_id, brand, size, color, condition, category, 
               predicted_label, confidence, recommended_price, description, image_path=None):
        """Create a new listing in the database."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO listings 
                (user_id, brand, size, color, condition, category, predicted_label, 
                 confidence, recommended_price, description, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, brand, size, color, condition, category, 
                  predicted_label, confidence, recommended_price, description, image_path))
            
            conn.commit()
            listing_id = cursor.lastrowid
            return {"success": True, "listing_id": listing_id}
        except Exception as e:
            print(f"Error creating listing: {e}")
            return {"success": False, "error": str(e)}
        finally:
            conn.close()
    
    @staticmethod
    def get_by_id(listing_id):
        """Retrieve a listing by ID."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM listings WHERE id = ?', (listing_id,))
            row = cursor.fetchone()
            
            if row:
                return dict(row)
            return None
        finally:
            conn.close()
    
    @staticmethod
    def get_by_user(user_id):
        """Retrieve all listings for a user."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT * FROM listings WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            conn.close()
    
    @staticmethod
    def update(listing_id, **kwargs):
        """Update a listing."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Build the SET clause dynamically
            set_clause = ', '.join([f'{key} = ?' for key in kwargs.keys()])
            set_clause += ', updated_at = CURRENT_TIMESTAMP'
            values = list(kwargs.values()) + [listing_id]
            
            cursor.execute(f'''
                UPDATE listings 
                SET {set_clause}
                WHERE id = ?
            ''', values)
            
            conn.commit()
            return {"success": True}
        except Exception as e:
            print(f"Error updating listing: {e}")
            return {"success": False, "error": str(e)}
        finally:
            conn.close()
    
    @staticmethod
    def delete(listing_id):
        """Delete a listing."""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('DELETE FROM listings WHERE id = ?', (listing_id,))
            conn.commit()
            return {"success": True}
        except Exception as e:
            print(f"Error deleting listing: {e}")
            return {"success": False, "error": str(e)}
        finally:
            conn.close()
