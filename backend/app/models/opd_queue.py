from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class OPDQueue(Base):
    __tablename__ = "opd_queue"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False,
        index=True
    )

    department = Column(String, nullable=False)

    token_number = Column(Integer, nullable=False)

    queue_position = Column(Integer, nullable=False)

    doctors_available = Column(
        Integer,
        default=1,
        nullable=False
    )

    patients_being_served = Column(
        Integer,
        default=0,
        nullable=False
    )

    average_consultation_duration = Column(
        Integer,
        default=10,
        nullable=False
    )

    status = Column(
        String,
        default="waiting",
        nullable=False
    )

    estimated_wait_minutes = Column(
        Integer,
        nullable=True
    )

    prediction_confidence = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )