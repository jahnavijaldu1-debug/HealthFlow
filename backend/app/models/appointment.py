from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False,
        index=True
    )

    doctor_name = Column(String, nullable=False)
    department = Column(String, nullable=False)

    appointment_time = Column(DateTime, nullable=False)

    status = Column(
        String,
        default="scheduled",
        nullable=False
    )

    token_number = Column(Integer, nullable=True)