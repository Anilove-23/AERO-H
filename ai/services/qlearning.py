import numpy as np

class HackathonAllocator:

    def __init__(self):
        self.W_DISTANCE = 0.35
        self.W_LOAD = 0.45
        self.W_EXP = 0.20
        self.W_AMB = 0.25
        self.LR = 0.01


    def calculate_score(self, hospital, patient_loc):

        dist = np.sqrt(
            (hospital['x'] - patient_loc[0])**2 +
            (hospital['y'] - patient_loc[1])**2
        )

        norm_dist = min(dist / 100, 1.0)

        load = 1 - (hospital['beds_available'] / hospital['total_beds'])

        ambulance_factor = 1 if hospital.get("ambulance_available", 0) > 0 else 0

        load_penalty = np.exp(load * 4) / 50

        score = (
            (self.W_EXP * hospital['doctor_experience'])
            + (self.W_AMB * ambulance_factor)
            - (self.W_DISTANCE * norm_dist)
            - (self.W_LOAD * load)
            - load_penalty
        )

        return score, load, norm_dist


    def update_weights(self, load, dist_norm):

        self.W_LOAD += self.LR * load
        self.W_DISTANCE += self.LR * dist_norm

        total = self.W_DISTANCE + self.W_LOAD + self.W_EXP + self.W_AMB

        self.W_DISTANCE /= total
        self.W_LOAD /= total


    def allocate_batch(self, hospitals, patients):

        results = []

        for p in patients:

            best_idx = -1
            best_score = -float("inf")
            best_load = None
            best_dist = None

            available = [h for h in hospitals if h["beds_available"] > 0]

            if not available:
                results.append({"error": "No beds available"})
                continue

            for i, h in enumerate(hospitals):

                if h["beds_available"] > 0:

                    score, load, dist = self.calculate_score(h, p["loc"])

                    if score > best_score:
                        best_score = score
                        best_idx = i
                        best_load = load
                        best_dist = dist

            target = hospitals[best_idx]

            target["beds_available"] -= 1

            # 🔥 FIX HERE
            hospital_id = str(target.get("_id"))

            ambulance_id = None

            self.update_weights(best_load, best_dist)

            results.append({
                "hospitalId": hospital_id,
                "ambulanceId": ambulance_id
            })

        return results