def assign_doctor(doctors, specialization, severity):
    """
    Doctor allocation system.

    Selects the most suitable doctor based on:
    - specialization
    - availability
    - experience
    - patient severity
    """

    if not doctors:
        return None

    # normalize specialization
    specialization = str(specialization).lower()

    # =============================
    # STEP 1: FILTER MATCHING DOCTORS
    # =============================
    filtered = []

    for doctor in doctors:

        doc_spec = str(doctor.get("specialization", "")).lower()
        available = doctor.get("available", False)

        # allow partial matches (cardiology inside "cardiology surgery")
        if specialization in doc_spec and available:
            filtered.append(doctor)

    # fallback if no specialization match
    if not filtered:
        filtered = [d for d in doctors if d.get("available", False)]

    if not filtered:
        return None

    # =============================
    # STEP 2: CRITICAL CASE
    # =============================
    if severity >= 8:

        senior_doc = next(
            (d for d in filtered if d.get("experienceLevel", "").lower() == "senior"),
            None
        )

        return senior_doc if senior_doc else filtered[0]

    # =============================
    # STEP 3: NON-CRITICAL CASE
    # =============================
    junior_doc = next(
        (d for d in filtered if d.get("experienceLevel", "").lower() == "junior"),
        None
    )

    return junior_doc if junior_doc else filtered[0]


# =============================
# TEST RUN
# =============================
if __name__ == "__main__":

    doctors_db = [
        {
            "id": "doc_mehta",
            "name": "Dr. Mehta",
            "specialization": "Cardiology",
            "experienceLevel": "Senior",
            "available": True
        },
        {
            "id": "doc_sharma",
            "name": "Dr. Sharma",
            "specialization": "Cardiology",
            "experienceLevel": "Junior",
            "available": True
        },
        {
            "id": "doc_ray",
            "name": "Dr. Ray",
            "specialization": "Neurology",
            "experienceLevel": "Senior",
            "available": False
        }
    ]

    # Critical Case
    assigned = assign_doctor(doctors_db, "Cardiology", 9)

    print(
        "Assigned for Critical Case:",
        assigned["name"] if assigned else "No doctor available"
    )

    # Mild Case
    assigned_mild = assign_doctor(doctors_db, "Cardiology", 4)

    print(
        "Assigned for Mild Case:",
        assigned_mild["name"] if assigned_mild else "No doctor available"
    )