import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# =============================
# LOAD ENV
# =============================
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

# =============================
# GEMINI CLIENT
# =============================
client = genai.Client(api_key=API_KEY)


def get_first_aid_advice(symptoms):
    """
    First Aid AI module.
    Returns emergency first aid instructions.
    """

    symptoms_str = ", ".join(symptoms) if isinstance(symptoms, list) else symptoms

    prompt = f"""
You are an emergency medical assistant.

Provide immediate life-saving first aid advice.

Symptoms:
{symptoms_str}

Return ONLY bullet points.
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0
            )
        )

        # extract text safely
        advice = ""

        if response.candidates:
            advice = response.candidates[0].content.parts[0].text

        advice = advice.strip()

        if not advice:
            return (
                "• Stay calm.\n"
                "• Call emergency services immediately.\n"
                "• Monitor breathing."
            )

        return advice

    except Exception as e:

        print("FirstAid AI Error:", e)

        return (
            "• Alert emergency responders immediately.\n"
            "• Ensure the patient is in a safe environment.\n"
            "• Monitor breathing until help arrives."
        )


# =============================
# TEST
# =============================
if __name__ == "__main__":

    symptoms = [
        "chest pain",
        "shortness of breath",
        "fainting"
    ]

    print(get_first_aid_advice(symptoms))