import sys
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
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

from services.qlearning import HackathonAllocator
from services.doctorAllocator import assign_doctor
from services.firstAidAI import get_first_aid_advice

# =============================
# RL ENGINE
# =============================
engine = HackathonAllocator()


# =============================
# REQUEST MODEL
# =============================
class EmergencyReport(BaseModel):
    message: str
    location: List[float]

    severityScore: float
    requiredSpecialization: str

    hospitals: List[Dict]
    doctors: List[Dict]
    ambulances: List[Dict]


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

    try:

        severity = report.severityScore
        specialization = report.requiredSpecialization.lower()

        # -------------------------
        # STEP 1: HOSPITAL ALLOCATION
        # -------------------------
        patient_data = [
            {
                "id": "current_patient",
                "loc": report.location
            }
        ]

        assignment_results = engine.allocate_batch(
            report.hospitals,
            patient_data
        )

        best_assignment = assignment_results[0]

        if "error" in best_assignment:
            raise HTTPException(
                status_code=503,
                detail="System Overloaded: No Beds Available"
            )

        hospital_id = best_assignment["hospitalId"]
        ambulance_id = best_assignment["ambulanceId"]

        hospital_obj = next(
            (h for h in report.hospitals if str(h["_id"]) == str(hospital_id)),
            None
        )

        if not hospital_obj:
            raise HTTPException(
                status_code=500,
                detail="Assigned hospital not found"
            )

        # -------------------------
        # STEP 2: DOCTOR ALLOCATION
        # -------------------------
        doctor = assign_doctor(
            report.doctors,
            specialization,
            severity
        )

        doctor_id = None

        if doctor and isinstance(doctor, dict):
            doctor_id = doctor.get("_id")

        # -------------------------
        # STEP 3: FIRST AID ADVICE
        # -------------------------
        try:
            first_aid = get_first_aid_advice([])
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
            "hospitalId": hospital_obj["_id"],
            "hospitalName": hospital_obj.get("name"),
            "doctorId": doctor_id,
            "ambulanceId": ambulance_id,
            "firstAid": first_aid
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Allocation Error: {str(e)}"
        )


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