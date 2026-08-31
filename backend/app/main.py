from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import os

from .database import get_db, Base, engine, SessionLocal
from .models import (
    Patient,
    MedicalRecord,
    LabReport,
    Appointment,
    OPDQueue,
    Consent,
    AuditLog,
    Doctor
)
from .init_db import initialize_database


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

initialize_database()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="HealthFlow API",
    description="Production-ready Backend API for HealthFlow Healthcare Platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
)

allowed_origins = [
    origin.strip()
    for origin in allowed_origins_env.split(",")
    if origin.strip()
]

allow_all_origins = "*" in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else allowed_origins,
    allow_credentials=False if allow_all_origins else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# IN-MEMORY OPD REAL-TIME QUEUE
# ============================================================

DOCTORS_AVAILABLE = 2
AVERAGE_CONSULTATION_DURATION = 11

DEFAULT_OPD_PATIENTS = [
    {
        "patient_id": 1,
        "token": "A-001",
        "name": "Rahul Sharma",
        "department": "General Medicine",
        "status": "Completed"
    },
    {
        "patient_id": 2,
        "token": "A-002",
        "name": "Priya Reddy",
        "department": "General Medicine",
        "status": "Completed"
    },
    {
        "patient_id": 3,
        "token": "A-003",
        "name": "Arjun Kumar",
        "department": "General Medicine",
        "status": "Completed"
    },
    {
        "patient_id": 4,
        "token": "A-004",
        "name": "Sneha Rao",
        "department": "General Medicine",
        "status": "Completed"
    },
    {
        "patient_id": 5,
        "token": "A-005",
        "name": "Vikram Singh",
        "department": "General Medicine",
        "status": "Completed"
    },
    {
        "patient_id": 6,
        "token": "A-006",
        "name": "Ananya Das",
        "department": "General Medicine",
        "status": "Consulting"
    },
    {
        "patient_id": 7,
        "token": "A-007",
        "name": "Kiran Patel",
        "department": "General Medicine",
        "status": "Waiting"
    },
    {
        "patient_id": 8,
        "token": "A-008",
        "name": "Meena Joseph",
        "department": "General Medicine",
        "status": "Waiting"
    },
    {
        "patient_id": 9,
        "token": "A-009",
        "name": "Rohit Verma",
        "department": "General Medicine",
        "status": "Waiting"
    },
    {
        "patient_id": 10,
        "token": "A-010",
        "name": "Rahul Sharma",
        "department": "General Medicine",
        "status": "Waiting"
    }
]

opd_patients = [p.copy() for p in DEFAULT_OPD_PATIENTS]


# ============================================================
# SUPPORTED LAB TESTS CONFIGURATION
# ============================================================

LAB_TESTS = {
    "hemoglobin": {
        "unit": "g/dL",
        "male_range": (13.0, 17.0),
        "female_range": (12.0, 15.0),
        "condition": "Anemia",
        "normal": "Your hemoglobin level is within the displayed reference range.",
        "low": "Your hemoglobin level is below the reference range. Hemoglobin helps red blood cells carry oxygen.",
        "high": "Your hemoglobin level is above the reference range. Discuss with your doctor for clinical interpretation."
    },

    "glucose": {
        "unit": "mg/dL",
        "range": (70.0, 99.0),
        "condition": "Diabetes-related monitoring",
        "normal": "Your glucose result is within the healthy reference range.",
        "low": "Your glucose result is below the reference range. Discuss dietary and clinical factors with your doctor.",
        "high": "Your glucose result is elevated above the reference range. Discuss blood-sugar monitoring with your doctor."
    },

    "fasting glucose": {
        "unit": "mg/dL",
        "range": (70.0, 99.0),
        "condition": "Diabetes-related monitoring",
        "normal": "Your fasting glucose result is within the displayed reference range.",
        "low": "Your fasting glucose result is below the displayed reference range.",
        "high": "Your fasting glucose result is above the reference range. Discuss results with your doctor."
    },

    "hba1c": {
        "unit": "%",
        "range": (4.0, 5.6),
        "condition": "Diabetes-related monitoring",
        "normal": "Your HbA1c result reflects healthy average glucose control over the past 3 months.",
        "low": "Your HbA1c result is below the standard reference range.",
        "high": "Your HbA1c result is elevated. HbA1c provides information about average blood sugar levels."
    },

    "creatinine": {
        "unit": "mg/dL",
        "range": (0.6, 1.3),
        "condition": "Kidney health monitoring",
        "normal": "Your creatinine result is within the healthy reference range, reflecting normal kidney filtration.",
        "low": "Your creatinine result is below the standard reference range.",
        "high": "Your creatinine result is above the reference range. Creatinine is monitored as an indicator of kidney function."
    },

    "urea": {
        "unit": "mg/dL",
        "range": (15.0, 45.0),
        "condition": "Kidney health monitoring",
        "normal": "Your urea result is within the healthy reference range.",
        "low": "Your urea result is below the standard reference range.",
        "high": "Your urea result is elevated. Urea is a metabolic byproduct measured to evaluate renal clearance."
    },

    "blood urea nitrogen": {
        "unit": "mg/dL",
        "range": (7.0, 20.0),
        "condition": "Kidney health monitoring",
        "normal": "Your BUN result is within the normal reference range.",
        "low": "Your BUN result is below the normal reference range.",
        "high": "Your BUN result is elevated. BUN is evaluated alongside creatinine for kidney health."
    },

    "egfr": {
        "unit": "mL/min/1.73m²",
        "range": (90.0, 200.0),
        "condition": "Kidney health monitoring",
        "normal": "Your estimated glomerular filtration rate (eGFR) indicates normal kidney filtering capacity.",
        "low": "Your eGFR is below the normal range, which may suggest reduced kidney filtering efficiency.",
        "high": "Your eGFR is in the high/normal range."
    },

    "wbc": {
        "unit": "x10³/µL",
        "range": (4.0, 11.0),
        "condition": "Immune & blood health",
        "normal": "Your white blood cell count is within the healthy reference range.",
        "low": "Your white blood cell count is lower than standard reference values.",
        "high": "Your white blood cell count is elevated. White blood cells play an active role in immune defense."
    }
}


# ============================================================
# SCHEMAS
# ============================================================

class LoginRequest(BaseModel):
    role: str
    username: Optional[str] = None
    password: Optional[str] = None
    patient_id: Optional[int] = 10
    healthflow_id: Optional[str] = "HF-2026-00142"


class PatientCreate(BaseModel):
    healthflow_id: str
    name: str
    age: int
    gender: str
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None


class DoctorCreate(BaseModel):
    name: str
    specialization: Optional[str] = None
    department: str
    phone: Optional[str] = None
    email: Optional[str] = None
    is_available: Optional[int] = 1


class JoinQueueRequest(BaseModel):
    patient_id: int
    name: str
    department: Optional[str] = "General Medicine"


class LabAnalysisRequest(BaseModel):
    test_name: str
    value: float
    gender: Optional[str] = "Unknown"
    patient_id: Optional[int] = 10


class RecordCreate(BaseModel):
    patient_id: int
    doctor_name: Optional[str] = None
    department: Optional[str] = None
    visit_type: Optional[str] = "Consultation"
    clinical_notes: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment: Optional[str] = None


class ConsentCreate(BaseModel):
    patient_id: int
    requester_name: str
    requester_role: str
    access_type: str
    duration_hours: Optional[int] = 24


class AuditCreate(BaseModel):
    patient_id: Optional[int] = None
    actor_name: str
    actor_role: str
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[int] = None
    details: Optional[str] = None


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_name: str
    department: str
    appointment_time: Optional[datetime] = None
    reason: Optional[str] = None


# ============================================================
# ROOT & HEALTH
# ============================================================

@app.get("/")
def root():
    return {
        "message": "HealthFlow API is running smoothly",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/auth/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    role = request.role.lower()

    if role == "patient":
        patient = None

        if request.healthflow_id:
            patient = (
                db.query(Patient)
                .filter(
                    Patient.healthflow_id == request.healthflow_id
                )
                .first()
            )

        if not patient and request.patient_id:
            patient = (
                db.query(Patient)
                .filter(Patient.id == request.patient_id)
                .first()
            )

        if not patient:
            patient = (
                db.query(Patient)
                .filter(Patient.id == 10)
                .first()
            )

        audit = AuditLog(
            patient_id=patient.id if patient else 10,
            actor_name=patient.name if patient else "Rahul Sharma",
            actor_role="Patient",
            action="Patient Portal Login",
            resource_type="Session",
            details="User logged in to Patient Portal"
        )

        db.add(audit)
        db.commit()

        return {
            "token": f"hf_pat_token_{patient.id if patient else 10}",
            "role": "patient",
            "user": {
                "id": patient.id if patient else 10,
                "name": patient.name if patient else "Rahul Sharma",
                "healthflow_id": (
                    patient.healthflow_id
                    if patient
                    else "HF-2026-00142"
                ),
                "gender": patient.gender if patient else "Male",
                "age": patient.age if patient else 42,
                "blood_group": (
                    patient.blood_group
                    if patient
                    else "O+"
                ),
                "allergies": (
                    patient.allergies
                    if patient
                    else "Penicillin"
                ),
                "phone": (
                    patient.phone
                    if patient
                    else "+91 98765 12345"
                ),
                "emergency_contact": (
                    patient.emergency_contact
                    if patient
                    else "Priya Sharma"
                ),
                "emergency_phone": (
                    patient.emergency_phone
                    if patient
                    else "+91 98765 43210"
                )
            }
        }

    elif role == "doctor":
        doctor = db.query(Doctor).first()

        return {
            "token": "hf_doc_token_1",
            "role": "doctor",
            "user": {
                "id": doctor.id if doctor else 1,
                "name": (
                    doctor.name
                    if doctor
                    else "Dr. Anil Kumar"
                ),
                "department": (
                    doctor.department
                    if doctor
                    else "General Medicine"
                ),
                "specialization": (
                    doctor.specialization
                    if doctor
                    else "Consultant Physician"
                ),
                "email": (
                    doctor.email
                    if doctor
                    else "anil.kumar@healthflow.org"
                )
            }
        }

    elif role == "admin":
        return {
            "token": "hf_adm_token_1",
            "role": "admin",
            "user": {
                "id": 1,
                "name": "Hospital Administrator",
                "email": "admin@healthflow.org",
                "facility": "CityCare Central Hospital"
            }
        }

    raise HTTPException(
        status_code=400,
        detail="Invalid role specified"
    )


# ============================================================
# PATIENTS API
# ============================================================

@app.get("/patients")
def get_all_patients(
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).all()

    return {
        "total_patients": len(patients),
        "patients": patients
    }


@app.get("/patients/{patient_id}")
def get_patient_by_id(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        if patient_id == 10:
            return {
                "id": 10,
                "healthflow_id": "HF-2026-00142",
                "name": "Rahul Sharma",
                "age": 42,
                "gender": "Male",
                "blood_group": "O+",
                "allergies": "Penicillin",
                "phone": "+91 98765 12345",
                "emergency_contact": "Priya Sharma",
                "emergency_phone": "+91 98765 43210"
            }

        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@app.get("/patients/healthflow/{healthflow_id}")
def get_patient_by_healthflow_id(
    healthflow_id: str,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.healthflow_id == healthflow_id
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@app.get("/patients/token/{token}")
def get_patient_by_token(
    token: str,
    db: Session = Depends(get_db)
):
    t = token.upper()

    p_match = next(
        (
            p
            for p in opd_patients
            if p["token"] == t
        ),
        None
    )

    if p_match:
        patient_id = p_match["patient_id"]

        db_patient = (
            db.query(Patient)
            .filter(Patient.id == patient_id)
            .first()
        )

        if db_patient:
            return {
                **p_match,
                "healthflow_id": db_patient.healthflow_id,
                "age": db_patient.age,
                "gender": db_patient.gender,
                "blood_group": db_patient.blood_group,
                "allergies": db_patient.allergies,
                "phone": db_patient.phone,
                "emergency_contact": (
                    db_patient.emergency_contact
                )
            }

        return p_match

    raise HTTPException(
        status_code=404,
        detail="Patient token not found"
    )


@app.post("/patients")
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(Patient)
        .filter(
            Patient.healthflow_id == data.healthflow_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="HealthFlow ID already exists"
        )

    new_patient = Patient(
        **data.model_dump()
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# ============================================================
# DOCTORS API
# ============================================================

@app.get("/doctors")
def get_doctors(
    db: Session = Depends(get_db)
):
    docs = db.query(Doctor).all()
    return docs


@app.post("/doctors")
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db)
):
    new_doc = Doctor(
        **data.model_dump()
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc


@app.patch("/doctors/{doctor_id}/availability")
def update_doctor_availability(
    doctor_id: int,
    available: bool,
    db: Session = Depends(get_db)
):
    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == doctor_id)
        .first()
    )

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
        "name": doctor.name,
        "department": doctor.department,
        "is_available": bool(
            doctor.is_available
        )
    }


# ============================================================
# OPD QUEUE & PREDICTION API
# ============================================================

@app.get("/opd/queue")
def get_opd_queue(
    db: Session = Depends(get_db)
):
    waiting = [
        p for p in opd_patients
        if p["status"] == "Waiting"
    ]

    consulting = [
        p for p in opd_patients
        if p["status"] == "Consulting"
    ]

    completed = [
        p for p in opd_patients
        if p["status"] == "Completed"
    ]

    active_docs_count = (
        db.query(Doctor)
        .filter(Doctor.is_available == 1)
        .count()
    )

    if active_docs_count == 0:
        active_docs_count = DOCTORS_AVAILABLE

    return {
        "department": "General Medicine",
        "patients": opd_patients,
        "total_patients": len(opd_patients),
        "waiting": len(waiting),
        "consulting": len(consulting),
        "completed": len(completed),
        "doctors_available": active_docs_count,
        "average_consultation_duration": (
            AVERAGE_CONSULTATION_DURATION
        ),
        "updated_at": datetime.now().isoformat()
    }


@app.get("/opd/prediction/{token}")
def get_patient_prediction(
    token: str,
    db: Session = Depends(get_db)
):
    token = token.upper()

    patient_index = next(
        (
            i
            for i, p in enumerate(opd_patients)
            if p["token"] == token
        ),
        None
    )

    active_docs = (
        db.query(Doctor)
        .filter(Doctor.is_available == 1)
        .count()
    )

    if active_docs <= 0:
        active_docs = DOCTORS_AVAILABLE

    if patient_index is None:
        return {
            "token": token,
            "status": "Waiting",
            "patients_ahead": 3,
            "doctors_available": active_docs,
            "average_consultation_duration": (
                AVERAGE_CONSULTATION_DURATION
            ),
            "patients_currently_being_served": 1,
            "estimated_waiting_time": round(
                (
                    3
                    * AVERAGE_CONSULTATION_DURATION
                )
                / max(active_docs, 1)
            ),
            "confidence_level": "Medium"
        }

    patient = opd_patients[patient_index]

    consulting = [
        p for p in opd_patients
        if p["status"] == "Consulting"
    ]

    if patient["status"] == "Completed":
        return {
            "token": token,
            "status": "Completed",
            "patients_ahead": 0,
            "doctors_available": active_docs,
            "average_consultation_duration": (
                AVERAGE_CONSULTATION_DURATION
            ),
            "patients_currently_being_served": 0,
            "estimated_waiting_time": 0,
            "confidence_level": "High"
        }

    if patient["status"] == "Consulting":
        return {
            "token": token,
            "status": "Consulting",
            "patients_ahead": 0,
            "doctors_available": active_docs,
            "average_consultation_duration": (
                AVERAGE_CONSULTATION_DURATION
            ),
            "patients_currently_being_served": len(
                consulting
            ),
            "estimated_waiting_time": 0,
            "confidence_level": "High"
        }

    waiting_before = [
        p
        for p in opd_patients[:patient_index]
        if p["status"] == "Waiting"
    ]

    patients_ahead = len(waiting_before)

    estimated_wait = round(
        (
            patients_ahead
            * AVERAGE_CONSULTATION_DURATION
        )
        / max(active_docs, 1)
    )

    if patients_ahead <= 2:
        confidence = "High"
    elif patients_ahead <= 5:
        confidence = "Medium"
    else:
        confidence = "Low"

    return {
        "token": token,
        "status": patient["status"],
        "patients_ahead": patients_ahead,
        "doctors_available": active_docs,
        "average_consultation_duration": (
            AVERAGE_CONSULTATION_DURATION
        ),
        "patients_currently_being_served": len(
            consulting
        ),
        "estimated_waiting_time": estimated_wait,
        "confidence_level": confidence
    }


@app.post("/opd/join")
def join_opd_queue(
    request: JoinQueueRequest
):
    existing = next(
        (
            p
            for p in opd_patients
            if p["patient_id"] == request.patient_id
        ),
        None
    )

    if existing:
        return {
            "message": "Already in queue",
            "patient": existing
        }

    num = len(opd_patients) + 1
    new_token = f"A-{num:03d}"

    new_item = {
        "patient_id": request.patient_id,
        "token": new_token,
        "name": request.name,
        "department": (
            request.department
            or "General Medicine"
        ),
        "status": "Waiting"
    }

    opd_patients.append(new_item)

    return {
        "message": "Joined OPD queue successfully",
        "patient": new_item
    }


@app.post("/opd/call-next")
def call_next_patient(
    db: Session = Depends(get_db)
):
    active_docs = (
        db.query(Doctor)
        .filter(Doctor.is_available == 1)
        .count()
    )

    if active_docs <= 0:
        active_docs = DOCTORS_AVAILABLE

    consulting_count = sum(
        1
        for p in opd_patients
        if p["status"] == "Consulting"
    )

    if consulting_count >= active_docs:
        return {
            "message": (
                "All doctors are currently consulting. "
                "Please complete an active consultation first."
            ),
            "patient": None
        }

    waiting_patient = next(
        (
            p
            for p in opd_patients
            if p["status"] == "Waiting"
        ),
        None
    )

    if not waiting_patient:
        return {
            "message": "No waiting patients in the queue.",
            "patient": None
        }

    waiting_patient["status"] = "Consulting"

    return {
        "message": (
            f"Called patient "
            f"{waiting_patient['name']} "
            f"(Token {waiting_patient['token']})"
        ),
        "patient": waiting_patient
    }


@app.post("/opd/complete/{token}")
def complete_opd_patient(
    token: str
):
    token = token.upper()

    patient = next(
        (
            p
            for p in opd_patients
            if p["token"] == token
        ),
        None
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient token not found"
        )

    patient["status"] = "Completed"

    return {
        "message": (
            f"Consultation for token "
            f"{token} marked as completed"
        ),
        "patient": patient
    }


@app.post("/opd/reset")
def reset_opd_queue():
    global opd_patients

    opd_patients = [
        p.copy()
        for p in DEFAULT_OPD_PATIENTS
    ]

    return {
        "message": (
            "OPD queue reset to demonstration "
            "initial state"
        ),
        "patients": opd_patients
    }


# ============================================================
# LAB REPORTS & SIMPLIFICATION API
# ============================================================

@app.post("/lab/analyze")
def analyze_lab_report(
    request: LabAnalysisRequest,
    db: Session = Depends(get_db)
):
    test_key = request.test_name.strip().lower()
    value = request.value
    gender = (
        request.gender or "unknown"
    ).strip().lower()

    if test_key not in LAB_TESTS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported test "
                f"'{request.test_name}'"
            )
        )

    if value < 0:
        raise HTTPException(
            status_code=400,
            detail="Lab value cannot be negative"
        )

    test_info = LAB_TESTS[test_key]

    if test_key == "hemoglobin":
        if gender == "male":
            low, high = test_info["male_range"]

        elif gender == "female":
            low, high = test_info["female_range"]

        else:
            low = min(
                test_info["male_range"][0],
                test_info["female_range"][0]
            )

            high = max(
                test_info["male_range"][1],
                test_info["female_range"][1]
            )

    else:
        low, high = test_info["range"]

    if value < low:
        status = "LOW"
        explanation = test_info["low"]

    elif value > high:
        status = "HIGH"
        explanation = test_info["high"]

    else:
        status = "NORMAL"
        explanation = test_info["normal"]

    ref_range_str = (
        f"{low} - {high} "
        f"{test_info['unit']}"
    )

    doc_discussion = (
        "Discuss this result with your doctor. "
        "Your doctor can interpret it together "
        "with your clinical symptoms and health history."
    )

    disclaimer = (
        "HealthFlow provides educational explanations. "
        "It does not provide medical diagnoses or prescribe treatment."
    )

    db_report = LabReport(
        patient_id=request.patient_id or 10,
        test_name=request.test_name.title(),
        value=value,
        unit=test_info["unit"],
        status=status,
        reference_range=ref_range_str,
        health_context=test_info["condition"],
        plain_language_explanation=explanation,
        doctor_discussion=doc_discussion
    )

    db.add(db_report)

    audit = AuditLog(
        patient_id=request.patient_id or 10,
        actor_name="HealthFlow Lab AI Analyzer",
        actor_role="System",
        action="Lab Analysis Generated",
        resource_type="LabReport",
        details=(
            f"Analyzed {request.test_name} "
            f"result ({value} "
            f"{test_info['unit']}) "
            f"with status {status}"
        )
    )

    db.add(audit)

    db.commit()
    db.refresh(db_report)

    return {
        "id": db_report.id,
        "patient_id": db_report.patient_id,
        "test_name": db_report.test_name,
        "value": db_report.value,
        "unit": db_report.unit,
        "status": db_report.status,
        "reference_range": db_report.reference_range,
        "condition_context": db_report.health_context,
        "explanation": db_report.plain_language_explanation,
        "doctor_discussion": db_report.doctor_discussion,
        "disclaimer": disclaimer,
        "created_at": db_report.created_at.isoformat()
    }


@app.get("/lab/patient/{patient_id}")
def get_patient_lab_reports(
    patient_id: int,
    db: Session = Depends(get_db)
):
    reports = (
        db.query(LabReport)
        .filter(
            LabReport.patient_id == patient_id
        )
        .order_by(
            LabReport.created_at.desc()
        )
        .all()
    )

    formatted = []

    for r in reports:
        formatted.append({
            "id": r.id,
            "patient_id": r.patient_id,
            "test_name": r.test_name,
            "value": r.value,
            "unit": r.unit,
            "status": r.status,
            "reference_range": r.reference_range,
            "condition_context": (
                r.health_context
                or "General"
            ),
            "explanation": (
                r.plain_language_explanation
            ),
            "doctor_discussion": (
                r.doctor_discussion
            ),
            "created_at": (
                r.created_at.isoformat()
                if r.created_at
                else datetime.now().isoformat()
            )
        })

    return {
        "patient_id": patient_id,
        "total_reports": len(formatted),
        "reports": formatted
    }


@app.get("/lab/all")
def get_all_lab_reports(
    db: Session = Depends(get_db)
):
    reports = (
        db.query(LabReport)
        .order_by(
            LabReport.created_at.desc()
        )
        .all()
    )

    return {
        "total_reports": len(reports),
        "reports": [
            {
                "id": r.id,
                "patient_id": r.patient_id,
                "test_name": r.test_name,
                "value": r.value,
                "unit": r.unit,
                "status": r.status,
                "reference_range": r.reference_range,
                "condition_context": (
                    r.health_context
                    or "General"
                ),
                "explanation": (
                    r.plain_language_explanation
                ),
                "created_at": (
                    r.created_at.isoformat()
                    if r.created_at
                    else datetime.now().isoformat()
                )
            }
            for r in reports
        ]
    }


@app.get("/lab/tests")
def get_supported_lab_tests():
    tests = []

    for name, item in LAB_TESTS.items():

        if name == "hemoglobin":
            ref = (
                f"{item['female_range'][0]}-"
                f"{item['female_range'][1]} (F) / "
                f"{item['male_range'][0]}-"
                f"{item['male_range'][1]} (M) "
                f"{item['unit']}"
            )

        else:
            ref = (
                f"{item['range'][0]} - "
                f"{item['range'][1]} "
                f"{item['unit']}"
            )

        tests.append({
            "test_name": name,
            "title": name.title(),
            "unit": item["unit"],
            "reference_range": ref,
            "condition": item["condition"]
        })

    return {
        "total_tests": len(tests),
        "tests": tests
    }


# ============================================================
# MEDICAL RECORDS API
# ============================================================

@app.get("/records/{patient_id}")
def get_medical_records(
    patient_id: int,
    db: Session = Depends(get_db)
):
    records = (
        db.query(MedicalRecord)
        .filter(
            MedicalRecord.patient_id == patient_id
        )
        .order_by(
            MedicalRecord.created_at.desc()
        )
        .all()
    )

    return records


@app.post("/records")
def create_medical_record(
    data: RecordCreate,
    db: Session = Depends(get_db)
):
    new_rec = MedicalRecord(
        **data.model_dump()
    )

    db.add(new_rec)

    audit = AuditLog(
        patient_id=data.patient_id,
        actor_name=data.doctor_name or "Doctor",
        actor_role="Doctor",
        action="Medical Record Added",
        resource_type="MedicalRecord",
        details=(
            f"Added consultation notes: "
            f"{data.diagnosis or 'Consultation note'}"
        )
    )

    db.add(audit)

    db.commit()
    db.refresh(new_rec)

    return new_rec


# ============================================================
# CONSENT MANAGEMENT API
# ============================================================

@app.get("/consent/{patient_id}")
def get_patient_consents(
    patient_id: int,
    db: Session = Depends(get_db)
):
    consents = (
        db.query(Consent)
        .filter(
            Consent.patient_id == patient_id
        )
        .order_by(
            Consent.created_at.desc()
        )
        .all()
    )

    return consents


@app.get("/consent/check/{patient_id}")
def check_patient_consent(
    patient_id: int,
    requester: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Consent)
        .filter(
            Consent.patient_id == patient_id,
            Consent.status == "granted"
        )
    )

    if requester:
        query = query.filter(
            Consent.requester_name.ilike(
                f"%{requester}%"
            )
        )

    active = query.first()

    return {
        "patient_id": patient_id,
        "has_active_consent": active is not None,
        "consent": active
    }


@app.post("/consent")
def create_consent_request(
    data: ConsentCreate,
    db: Session = Depends(get_db)
):
    expires = (
        datetime.now()
        + timedelta(
            hours=data.duration_hours or 24
        )
    )

    new_consent = Consent(
        patient_id=data.patient_id,
        requester_name=data.requester_name,
        requester_role=data.requester_role,
        access_type=data.access_type,
        status="pending",
        expires_at=expires
    )

    db.add(new_consent)

    audit = AuditLog(
        patient_id=data.patient_id,
        actor_name=data.requester_name,
        actor_role=data.requester_role,
        action="Consent Requested",
        resource_type="Consent",
        details=(
            f"Access requested for "
            f"{data.access_type}"
        )
    )

    db.add(audit)

    db.commit()
    db.refresh(new_consent)

    return new_consent


@app.patch("/consent/{consent_id}/decision")
def update_consent_decision(
    consent_id: int,
    decision: str,
    db: Session = Depends(get_db)
):
    decision_clean = (
        decision.lower().strip()
    )

    if decision_clean not in [
        "granted",
        "rejected",
        "revoked"
    ]:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid decision. "
                "Must be granted, rejected, or revoked."
            )
        )

    consent = (
        db.query(Consent)
        .filter(Consent.id == consent_id)
        .first()
    )

    if not consent:
        raise HTTPException(
            status_code=404,
            detail="Consent request not found"
        )

    consent.status = decision_clean

    if decision_clean == "granted":
        consent.expires_at = (
            datetime.now()
            + timedelta(hours=24)
        )

    audit = AuditLog(
        patient_id=consent.patient_id,
        actor_name="Patient",
        actor_role="Patient",
        action=(
            f"Consent "
            f"{decision_clean.title()}"
        ),
        resource_type="Consent",
        resource_id=consent.id,
        details=(
            f"Consent decision changed to "
            f"'{decision_clean}' for "
            f"{consent.requester_name}"
        )
    )

    db.add(audit)

    db.commit()
    db.refresh(consent)

    return consent


# ============================================================
# AUDIT LOGS API
# ============================================================

@app.get("/audit/{patient_id}")
def get_patient_audit_logs(
    patient_id: int,
    db: Session = Depends(get_db)
):
    logs = (
        db.query(AuditLog)
        .filter(
            AuditLog.patient_id == patient_id
        )
        .order_by(
            AuditLog.created_at.desc()
        )
        .all()
    )

    return logs


@app.post("/audit")
def create_audit_log(
    data: AuditCreate,
    db: Session = Depends(get_db)
):
    new_log = AuditLog(
        **data.model_dump()
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return new_log


# ============================================================
# APPOINTMENTS API
# ============================================================

@app.get("/appointments/{patient_id}")
def get_patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db)
):
    apps = (
        db.query(Appointment)
        .filter(
            Appointment.patient_id == patient_id
        )
        .order_by(
            Appointment.appointment_time.asc()
        )
        .all()
    )

    return apps


@app.post("/appointments")
def create_appointment(
    data: AppointmentCreate,
    db: Session = Depends(get_db)
):
    app_time = (
        data.appointment_time
        or (
            datetime.now()
            + timedelta(days=1, hours=3)
        )
    )

    new_app = Appointment(
        patient_id=data.patient_id,
        doctor_name=data.doctor_name,
        department=data.department,
        appointment_time=app_time,
        status="scheduled",
        token_number=len(opd_patients) + 1
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return new_app


# ============================================================
# ADMIN DASHBOARD SUMMARY
# ============================================================

@app.get("/admin/summary")
def get_admin_summary(
    db: Session = Depends(get_db)
):
    waiting = sum(
        1
        for p in opd_patients
        if p["status"] == "Waiting"
    )

    consulting = sum(
        1
        for p in opd_patients
        if p["status"] == "Consulting"
    )

    completed = sum(
        1
        for p in opd_patients
        if p["status"] == "Completed"
    )

    total_opd = len(opd_patients)

    active_docs = (
        db.query(Doctor)
        .filter(Doctor.is_available == 1)
        .count()
    )

    total_doctors = db.query(Doctor).count()

    if total_doctors == 0:
        total_doctors = 5
        active_docs = 2

    completion_rate = (
        round(
            (completed / total_opd) * 100
        )
        if total_opd
        else 0
    )

    total_labs = db.query(LabReport).count()
    total_patients_count = db.query(Patient).count()

    return {
        "total_patients": total_opd,
        "registered_patients": total_patients_count,
        "waiting_patients": waiting,
        "consulting_patients": consulting,
        "completed_patients": completed,
        "completion_rate": completion_rate,
        "active_doctors": active_docs,
        "total_doctors": total_doctors,
        "average_consultation_duration": (
            AVERAGE_CONSULTATION_DURATION
        ),
        "total_lab_reports": total_labs,
        "updated_at": datetime.now().isoformat()
    }