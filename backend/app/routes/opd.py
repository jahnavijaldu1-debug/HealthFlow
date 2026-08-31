from fastapi import APIRouter
from pydantic import BaseModel

from app.services.opd_service import (
    get_queue,
    join_queue,
    call_next,
    complete_patient,
    calculate_waiting_time
)

router = APIRouter(
    prefix="/opd",
    tags=["OPD Queue"]
)


class JoinQueueRequest(BaseModel):
    patient_id: int
    name: str = "Demo Patient"


class PredictionRequest(BaseModel):
    current_queue: int
    doctors_available: int
    average_consultation_duration: float
    patients_being_served: int
    department: str = "General Medicine"


@router.get("/queue")
def queue():
    return get_queue()


@router.post("/join")
def join(data: JoinQueueRequest):
    return join_queue(
        data.patient_id,
        data.name
    )


@router.post("/next")
def next_patient():
    patient = call_next()

    if not patient:
        return {"message": "No waiting patients"}

    return patient


@router.post("/complete/{patient_id}")
def complete(patient_id: int):
    patient = complete_patient(patient_id)

    if not patient:
        return {"message": "Patient not found"}

    return patient


@router.post("/predict")
def predict(data: PredictionRequest):

    return calculate_waiting_time(
        data.current_queue,
        data.doctors_available,
        data.average_consultation_duration,
        data.patients_being_served
    )