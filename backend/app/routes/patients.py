from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient

router = APIRouter(prefix="/patients", tags=["Patients"])


class PatientCreate(BaseModel):
    healthflow_id: str
    name: str
    age: int
    gender: str
    blood_group: str | None = None
    allergies: str | None = None
    phone: str | None = None
    emergency_contact: str | None = None
    emergency_phone: str | None = None


@router.post("/")
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(
        Patient.healthflow_id == patient.healthflow_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="HealthFlow ID already exists"
        )

    new_patient = Patient(**patient.model_dump())

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


@router.get("/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient