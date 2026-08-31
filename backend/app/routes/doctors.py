from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.doctor import Doctor

router = APIRouter(prefix="/doctors", tags=["Doctors"])


class DoctorCreate(BaseModel):
    name: str
    specialization: str | None = None
    department: str
    phone: str | None = None
    email: str | None = None


@router.post("/")
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db)
):
    doctor = Doctor(**data.model_dump())

    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor


@router.get("/")
def get_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()


@router.patch("/{doctor_id}/availability")
def update_availability(
    doctor_id: int,
    available: bool,
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(
        Doctor.id == doctor_id
    ).first()

    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    doctor.is_available = int(available)

    db.commit()
    db.refresh(doctor)

    return {
        "doctor_id": doctor.id,
        "is_available": bool(doctor.is_available)
    }