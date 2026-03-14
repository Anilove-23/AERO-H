import os
import json
from dotenv import load_dotenv
from google import genai

# =============================
# LOAD ENV VARIABLES
# =============================
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

# =============================
# CREATE GEMINI CLIENT
# =============================
client = genai.Client(api_key=API_KEY)


def analyze_emergency(message):
    """
    AI triage system that extracts structured emergency data
    from a patient message.
    """

    prompt = f"""
You are an emergency medical triage assistant.

Extract structured information from the patient message.

Return JSON ONLY with these fields:
- severity_score (1-10)
- priority (low, medium, high, critical)
- symptoms (array)
- required_specialization
- possible_condition

Message:
"{message}"
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text

        # Remove markdown formatting if Gemini adds it
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        return json.loads(text)

    except Exception as e:
        return {
            "error": "AI parsing failed",
            "details": str(e),
            "severity_score": 5,
            "priority": "medium",
            "symptoms": [],
            "required_specialization": "general",
            "possible_condition": "unknown"
        }


# =============================
# QUICK TEST
# =============================
if __name__ == "__main__":
    test_message = "My chest feels very tight and I am struggling to breathe."
    result = analyze_emergency(test_message)
    print(json.dumps(result, indent=4))