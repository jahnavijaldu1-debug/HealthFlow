DEMO_QUEUE = [
    {"id": 1, "patient_id": 1, "token_number": 1, "name": "Rahul", "status": "waiting"},
    {"id": 2, "patient_id": 2, "token_number": 2, "name": "Priya", "status": "waiting"},
    {"id": 3, "patient_id": 3, "token_number": 3, "name": "Arjun", "status": "serving"},
    {"id": 4, "patient_id": 4, "token_number": 4, "name": "Sneha", "status": "waiting"},
    {"id": 5, "patient_id": 5, "token_number": 5, "name": "Kiran", "status": "waiting"},
    {"id": 6, "patient_id": 6, "token_number": 6, "name": "Anjali", "status": "waiting"},
    {"id": 7, "patient_id": 7, "token_number": 7, "name": "Rohit", "status": "waiting"},
    {"id": 8, "patient_id": 8, "token_number": 8, "name": "Meena", "status": "waiting"},
    {"id": 9, "patient_id": 9, "token_number": 9, "name": "Vikram", "status": "waiting"},
    {"id": 10, "patient_id": 10, "token_number": 10, "name": "Kavya", "status": "waiting"},
]


def get_queue():
    queue = []

    position = 1

    for patient in DEMO_QUEUE:

        if patient["status"] == "completed":
            continue

        item = patient.copy()
        item["queue_position"] = position

        queue.append(item)
        position += 1

    return queue


def join_queue(patient_id: int, name: str):
    existing = next(
        (p for p in DEMO_QUEUE if p["patient_id"] == patient_id),
        None
    )

    if existing:
        return existing

    token = max(p["token_number"] for p in DEMO_QUEUE) + 1

    patient = {
        "id": len(DEMO_QUEUE) + 1,
        "patient_id": patient_id,
        "token_number": token,
        "name": name,
        "status": "waiting"
    }

    DEMO_QUEUE.append(patient)

    return patient


def call_next():
    patient = next(
        (p for p in DEMO_QUEUE if p["status"] == "waiting"),
        None
    )

    if not patient:
        return None

    patient["status"] = "serving"

    return patient


def complete_patient(patient_id: int):
    patient = next(
        (p for p in DEMO_QUEUE if p["patient_id"] == patient_id),
        None
    )

    if not patient:
        return None

    patient["status"] = "completed"

    return patient


def calculate_waiting_time(
    current_queue,
    doctors_available,
    average_consultation_duration,
    patients_being_served
):

    if doctors_available <= 0:
        return {
            "estimated_waiting_time": None,
            "confidence_level": "Low"
        }

    waiting_patients = max(
        0,
        current_queue - patients_being_served
    )

    wait = (
        waiting_patients
        * average_consultation_duration
    ) / doctors_available

    return {
        "estimated_waiting_time": round(wait),
        "confidence_level": "Demo estimate"
    }