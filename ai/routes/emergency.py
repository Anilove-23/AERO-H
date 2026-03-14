import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# =============================
# FASTAPI INIT
# =============================
app = FastAPI(title="AERO-H Emergency AI API")

# =============================
# CORS CONFIG
# =============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# IMPORT PATH FIX
# =============================
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.triageAI import analyze_emergency
from services.firstAidAI import get_first_aid_advice
from services.qlearning import HackathonAllocator
from services.doctorAllocator import assign_doctor

# =============================
# RL ENGINE
# =============================
engine = HackathonAllocator()

# =============================
# REQUEST MODEL
# =============================
class EmergencyReport(BaseModel):
    message: str
    location: List[float]  # [x, y]


# =============================
# MOCK DATABASE
# =============================
hospitals_db = [
    {
        "id": "hospital_1",
        "name": "City Hospital",
        "x": 10,
        "y": 10,
        "beds_available": 5,
        "total_beds": 10,
        "doctor_experience": 0.9,
        "specializations": ["cardiology", "emergency"],
        "ambulance_available": 2
    },
    {
        "id": "hospital_2",
        "name": "Metro Hospital",
        "x": 2,
        "y": 2,
        "beds_available": 1,
        "total_beds": 10,
        "doctor_experience": 0.7,
        "specializations": ["general", "emergency"],
        "ambulance_available": 1
    }
]

doctors_db = [
    {
        "id": "doc_mehta",
        "name": "Dr Mehta",
        "specialization": "cardiology",
        "experienceLevel": "Senior",
        "available": True
    },
    {
        "id": "doc_sharma",
        "name": "Dr Sharma",
        "specialization": "general",
        "experienceLevel": "Junior",
        "available": True
    }
]


# =============================
# HEALTH CHECK
# =============================
@app.get("/")
def health_check():
    return {"status": "AERO-H Emergency AI Running"}


# =============================
# EMERGENCY REPORT API
# =============================
@app.post("/report")
async def report_emergency(report: EmergencyReport):

    # -------------------------
    # STEP 1: AI TRIAGE
    # -------------------------
    try:
        triage = analyze_emergency(report.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Triage Failed: {str(e)}")

    if not triage:
        triage = {
            "severity_score": 5,
            "priority": "medium",
            "symptoms": [],
            "required_specialization": "general",
            "possible_condition": "unknown"
        }

    # normalize specialization
    specialization = triage.get("required_specialization", "general").lower()
    severity = triage.get("severity_score", 5)

    # -------------------------
    # STEP 2: HOSPITAL ALLOCATION
    # -------------------------
    patient_data = [
        {
            "id": "current_patient",
            "loc": report.location
        }
    ]

    try:
        assignment_results = engine.allocate_batch(hospitals_db, patient_data)
        best_assignment = assignment_results[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Allocator Error: {str(e)}")

    if "error" in best_assignment:
        raise HTTPException(
            status_code=503,
            detail="System Overloaded: No Beds Available"
        )

    hospital_id = best_assignment["hospitalId"]
    ambulance_id = best_assignment["ambulanceId"]

    hospital_obj = next(
        (h for h in hospitals_db if h["id"] == hospital_id),
        None
    )

    if not hospital_obj:
        raise HTTPException(status_code=500, detail="Assigned hospital not found")

    # -------------------------
    # STEP 3: DOCTOR ALLOCATION
    # -------------------------
    doctor = assign_doctor(
        doctors_db,
        specialization,
        severity
    )

    if doctor and isinstance(doctor, dict):
        doctor["available"] = False
        doctor_id = doctor.get("id", doctor["name"])
    else:
        doctor_id = "staff_assigned"

    # -------------------------
    # STEP 4: FIRST AID ADVICE
    # -------------------------
    try:
        first_aid = get_first_aid_advice(
            triage.get("symptoms", [])
        )
    except Exception:
        first_aid = (
            "• Call emergency services immediately.\n"
            "• Ensure patient is safe and breathing.\n"
            "• Stay calm until help arrives."
        )

    # -------------------------
    # FINAL RESPONSE
    # -------------------------
    return {
        "hospitalId": hospital_obj["id"],
        "hospitalName": hospital_obj["name"],
        "doctorId": doctor_id,
        "ambulanceId": ambulance_id,
        "firstAid": first_aid,
        "triage": triage
    }


# =============================
# RUN SERVER
# =============================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "routes.emergency:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )