def calculate_basic_waiting_time(
    current_queue: int,
    doctors_available: int,
    average_consultation_duration: float,
    patients_being_served: int
):
    if doctors_available <= 0:
        return None

    waiting_patients = max(
        0,
        current_queue - patients_being_served
    )

    return round(
        (waiting_patients / doctors_available)
        * average_consultation_duration
    )