# Database Setup

This project uses SQLite for local development to store listings.

## Files

- `database.py` - Database connection and initialization
- `models.py` - Listing model with CRUD operations

## Database Schema

### listings table
- `id` - Primary key (auto-increment)
- `user_id` - User identifier
- `brand` - Item brand
- `size` - Item size
- `color` - Item color
- `condition` - Item condition
- `category` - Predicted clothing category
- `predicted_label` - CNN model label
- `confidence` - Model prediction confidence
- `recommended_price` - Recommended price
- `description` - Item description
- `image_path` - Path to uploaded image
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

## Initialize Database

The database is automatically initialized when the Flask app starts. To manually initialize:

```bash
python flask/database.py
```

This will create `listings.db` in the backend root directory.

## API Endpoints

### Create Listing
```
POST /create-listing
Content-Type: multipart/form-data

Parameters:
- image (file, required)
- brand (string)
- size (string)
- color (string)
- condition (string)
- user_id (string, optional - auto-generated if not provided)

Response:
{
  "listing_id": 1,
  "category": "T-shirt",
  "confidence": 0.95,
  "recommended_price": 0,
  "description": ""
}
```

### Get User Listings
```
GET /listings/<user_id>

Response:
{
  "listings": [...],
  "count": 5
}
```

### Get Single Listing
```
GET /listing/<listing_id>

Response:
{
  "id": 1,
  "user_id": "...",
  "brand": "Nike",
  "category": "T-shirt",
  ...
}
```

### Update Listing
```
PUT /listing/<listing_id>
Content-Type: application/json

Body:
{
  "brand": "Nike",
  "description": "Updated description"
}
```

### Delete Listing
```
DELETE /listing/<listing_id>
```

## Database Location

The SQLite database file (`listings.db`) is stored in the backend root directory:
```
/Users/fatemehpourkazemkhales/Desktop/neurosell/backend/listings.db
```
