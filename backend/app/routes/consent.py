from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consent import Consent

router = APIRouter(prefix="/consent", tags=["Consent"])


class ConsentCreate(BaseModel):
    patient_id: int
    requester_name: str
    requester_role: str
    access_type: str


@router.post("/")
def create_consent(
    data: ConsentCreate,
    db: Session = Depends(get_db)
):
    consent = Consent(
        **data.model_dump(),
        status="pending"
    )

    db.add(consent)
    db.commit()
    db.refresh(consent)

    return consent


@router.get("/{patient_id}")
def get_consents(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Consent).filter(
        Consent.patient_id == patient_id
    ).all()


@router.patch("/{consent_id}/decision")
def update_consent(
    consent_id: int,
    decision: str,
    db: Session = Depends(get_db)
):
    if decision not in ["granted", "rejected", "revoked"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid consent decision"
        )

    consent = db.query(Consent).filter(
        Consent.id == consent_id
    ).first()

    if not consent:
        raise HTTPException(
            status_code=404,
            detail="Consent request not found"
        )

    consent.status = decision

    db.commit()
    db.refresh(consent)

    return consent