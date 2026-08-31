from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.medical_record import MedicalRecord

router = APIRouter(prefix="/records", tags=["Medical Records"])


class RecordCreate(BaseModel):
    patient_id: int
    doctor_name: str | None = None
    department: str | None = None
    visit_type: str | None = None
    clinical_notes: str | None = None
    diagnosis: str | None = None
    treatment: str | None = None


@router.post("/")
def create_record(record: RecordCreate, db: Session = Depends(get_db)):
    new_record = MedicalRecord(**record.model_dump())

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@router.get("/{patient_id}")
def get_records(patient_id: int, db: Session = Depends(get_db)):
    records = db.query(MedicalRecord).filter(
        MedicalRecord.patient_id == patient_id
    ).all()

    return records