from sqlalchemy import Column, Integer, String
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    department = Column(String, nullable=False)

    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    is_available = Column(
        Integer,
        default=1,
        nullable=False
    )