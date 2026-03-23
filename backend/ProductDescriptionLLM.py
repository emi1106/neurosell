from openai import OpenAI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI(
    api_key="212bbd9f5b849bdd3f0a3e1fa75f115a",
    base_url="https://chat-ai.academiccloud.de/v1"
)

def generate_description(data=None, **kwargs):
    """
    Generate a product description for an online marketplace.
    
    Can be called with either:
    - A dictionary: generate_description({"category": "...", "brand": "...", ...})
    - Keyword arguments: generate_description(category="...", brand="...", ...)
    """
    try:
        # Support both dictionary and keyword arguments
        if data is None:
            data = kwargs
        elif isinstance(data, dict) and kwargs:
            # Merge both if both are provided
            data = {**data, **kwargs}
        
        # Extract fields with defaults
        category = data.get('category', 'Unknown')
        brand = data.get('brand', 'Unknown')
        size = data.get('size', 'One Size')
        color = data.get('color', 'Unknown')
        condition = data.get('condition', 'Unknown')
        price = data.get('price', 'Not specified')
        
        prompt = f"""
        Generate a product description for an online marketplace:

        Category: {category}
        Brand: {brand}
        Size: {size}
        Color: {color}
        Condition: {condition}
        Price: ${price}

        Keep it very short, attractive, and professional.
        Don't use asterisks or any special characters. Avoid using emojis. Focus on the key features and appeal of the product.
        It should sound like a human wrote it, not an AI. The description should be concise and highlight when the product was purchased, its condition, and the conditions in which it was used.
        """

        logger.info(f"Calling OpenAI API for description - Category: {category}, Brand: {brand}")
        
        response = client.chat.completions.create(
            model="openai-gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are an assistant that writes product descriptions."},
                {"role": "user", "content": prompt}
            ],
            timeout=30
        )

        description = response.choices[0].message.content
        logger.info(f"Successfully generated description")
        return description
        
    except Exception as e:
        logger.error(f"Error generating description: {str(e)}")
        
        # Return a fallback description if API fails
        fallback_description = f"{brand} {category} in {color} ({condition} condition) - Size {size}. Price: ${price}"
        logger.warning(f"Using fallback description: {fallback_description}")
        return fallback_description