from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database import Base


class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, nullable=True, index=True)

    test_name = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    status = Column(String, nullable=False)
    reference_range = Column(String, nullable=False)

    health_context = Column(String, nullable=True)

    plain_language_explanation = Column(String, nullable=False)
    doctor_discussion = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )