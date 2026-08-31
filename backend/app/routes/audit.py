from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/audit", tags=["Audit"])


class AuditCreate(BaseModel):
    patient_id: int | None = None
    actor_name: str
    actor_role: str
    action: str
    resource_type: str | None = None
    resource_id: int | None = None
    details: str | None = None


@router.post("/")
def create_audit_log(
    data: AuditCreate,
    db: Session = Depends(get_db)
):
    log = AuditLog(**data.model_dump())

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


@router.get("/{patient_id}")
def get_audit_logs(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).filter(
        AuditLog.patient_id == patient_id
    ).order_by(
        AuditLog.created_at.desc()
    ).all()