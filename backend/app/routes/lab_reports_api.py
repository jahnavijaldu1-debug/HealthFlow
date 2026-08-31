from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lab_report import LabReport
from app.services.ai_service import analyze_lab_report

router = APIRouter(prefix="/lab-reports", tags=["Lab Reports"])


class LabReportCreate(BaseModel):
    patient_id: int
    test_name: str
    value: float
    unit: str | None = None


@router.post("/")
def create_lab_report(
    report: LabReportCreate,
    db: Session = Depends(get_db)
):
    analysis = analyze_lab_report(
        report.test_name,
        report.value
    )

    new_report = LabReport(
        patient_id=report.patient_id,
        test_name=report.test_name,
        value=report.value,
        unit=analysis.get("unit", report.unit),
        reference_range=analysis.get("reference_range"),
        status=analysis.get("status"),
        ai_explanation=analysis.get("explanation"),
        caution=analysis.get("caution")
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@router.get("/{patient_id}")
def get_lab_reports(
    patient_id: int,
    db: Session = Depends(get_db)
):
    return db.query(LabReport).filter(
        LabReport.patient_id == patient_id
    ).all()