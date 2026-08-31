from app.database import Base, engine
from app.models import (
    Patient,
    MedicalRecord,
    LabReport,
    Appointment,
    OPDQueue,
    Consent,
    AuditLog,
    Doctor
)


def initialize_database():
    Base.metadata.create_all(bind=engine)
    print("HealthFlow database initialized successfully.")


if __name__ == "__main__":
    initialize_database()