from openai import OpenAI

client = OpenAI(
    api_key="212bbd9f5b849bdd3f0a3e1fa75f115a",
    base_url="https://chat-ai.academiccloud.de/v1"
)

def generate_description(data):
    prompt = f"""
    Generate a product description for an online marketplace:

    Category: {data['category']}
    Brand: {data['brand']}
    Size: {data['size']}
    Color: {data['color']}
    Condition: {data['condition']}

    Keep it short, attractive, and professional.
    """

    response = client.chat.completions.create(
        model="openai-gpt-oss-120b",
        messages=[
            {"role": "system", "content": "You are an assistant that writes product descriptions."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content