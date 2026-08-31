from sqlalchemy import Column, Integer, String, Date
from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    healthflow_id = Column(String, unique=True, index=True, nullable=False)

    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)

    blood_group = Column(String, nullable=True)
    allergies = Column(String, nullable=True)

    phone = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    emergency_phone = Column(String, nullable=True)

    date_of_birth = Column(Date, nullable=True)