from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="HealthFlow API",
    description="Backend API for the HealthFlow healthcare platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DEMO OPD PATIENTS
# ============================================================

DEMO_PATIENTS = [
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
        "name": "Jahnavi",
        "department": "General Medicine",
        "status": "Waiting"
    }
]


DOCTORS_AVAILABLE = 2
AVERAGE_CONSULTATION_DURATION = 11


# ============================================================
# LAB TEST INFORMATION
# ============================================================

LAB_TESTS = {

    "hemoglobin": {
        "unit": "g/dL",
        "male_range": (13.0, 17.0),
        "female_range": (12.0, 15.0),
        "condition": "Anemia",
        "normal": (
            "Your hemoglobin level is within the displayed "
            "reference range."
        ),
        "low": (
            "Your hemoglobin level is below the displayed "
            "reference range. Hemoglobin is a protein in red "
            "blood cells that helps carry oxygen through the body."
        ),
        "high": (
            "Your hemoglobin level is above the displayed "
            "reference range. Your doctor can interpret this "
            "together with your other health information."
        )
    },

    "glucose": {
        "unit": "mg/dL",
        "range": (70.0, 99.0),
        "condition": "Diabetes-related monitoring",
        "normal": (
            "Your glucose result is within the displayed "
            "reference range."
        ),
        "low": (
            "Your glucose result is below the displayed "
            "reference range. Glucose is the main sugar "
            "your body uses for energy."
        ),
        "high": (
            "Your glucose result is above the displayed "
            "reference range. Your doctor can interpret "
            "this together with other blood-sugar information."
        )
    },

    "fasting glucose": {
        "unit": "mg/dL",
        "range": (70.0, 99.0),
        "condition": "Diabetes-related monitoring",
        "normal": (
            "Your fasting glucose result is within the "
            "displayed reference range."
        ),
        "low": (
            "Your fasting glucose result is below the "
            "displayed reference range."
        ),
        "high": (
            "Your fasting glucose result is above the "
            "displayed reference range. Discuss the result "
            "with your doctor."
        )
    },

    "hba1c": {
        "unit": "%",
        "range": (4.0, 5.6),
        "condition": "Diabetes-related monitoring",
        "normal": (
            "Your HbA1c result is within the displayed "
            "reference range."
        ),
        "low": (
            "Your HbA1c result is below the displayed "
            "reference range."
        ),
        "high": (
            "Your HbA1c result is above the displayed "
            "reference range. HbA1c provides information "
            "about average blood glucose over a period of time."
        )
    },

    "creatinine": {
        "unit": "mg/dL",
        "range": (0.6, 1.3),
        "condition": "Kidney health monitoring",
        "normal": (
            "Your creatinine result is within the displayed "
            "reference range."
        ),
        "low": (
            "Your creatinine result is below the displayed "
            "reference range."
        ),
        "high": (
            "Your creatinine result is above the displayed "
            "reference range. Creatinine is one measurement "
            "used when assessing kidney function."
        )
    },

    "urea": {
        "unit": "mg/dL",
        "range": (15.0, 45.0),
        "condition": "Kidney health monitoring",
        "normal": (
            "Your urea result is within the displayed "
            "reference range."
        ),
        "low": (
            "Your urea result is below the displayed "
            "reference range."
        ),
        "high": (
            "Your urea result is above the displayed "
            "reference range. Urea is a waste product "
            "measured in blood."
        )
    },

    "blood urea nitrogen": {
        "unit": "mg/dL",
        "range": (7.0, 20.0),
        "condition": "Kidney health monitoring",
        "normal": (
            "Your BUN result is within the displayed "
            "reference range."
        ),
        "low": (
            "Your BUN result is below the displayed "
            "reference range."
        ),
        "high": (
            "Your BUN result is above the displayed "
            "reference range. BUN is one measurement "
            "used when evaluating kidney-related health."
        )
    },

    "egfr": {
        "unit": "mL/min/1.73m²",
        "range": (90.0, 200.0),
        "condition": "Kidney health monitoring",
        "normal": (
            "Your eGFR result is within the reference "
            "range used for this demonstration."
        ),
        "low": (
            "Your eGFR result is below the reference range "
            "used for this demonstration. eGFR is an estimate "
            "related to kidney filtration."
        ),
        "high": (
            "Your eGFR result is above the reference range "
            "used for this demonstration."
        )
    },

    "wbc": {
        "unit": "×10³/µL",
        "range": (4.0, 11.0),
        "condition": "Blood health monitoring",
        "normal": (
            "Your white blood cell count is within the "
            "displayed reference range."
        ),
        "low": (
            "Your white blood cell count is below the "
            "displayed reference range."
        ),
        "high": (
            "Your white blood cell count is above the "
            "displayed reference range. White blood cells "
            "are part of the immune system."
        )
    }
}


# ============================================================
# SAVED LAB REPORTS
# ============================================================

LAB_REPORTS = [
    {
        "id": 1,
        "patient_id": 1,
        "test_name": "Hemoglobin",
        "value": 14.2,
        "unit": "g/dL",
        "status": "NORMAL",
        "reference_range": "13.0 - 17.0 g/dL",
        "condition_context": "Anemia",
        "explanation": (
            "Your hemoglobin level is within the displayed "
            "reference range."
        ),
        "doctor_discussion": (
            "Discuss this result with your doctor together "
            "with your symptoms and other clinical information."
        ),
        "disclaimer": (
            "HealthFlow provides educational information and "
            "does not provide a medical diagnosis."
        ),
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 2,
        "patient_id": 2,
        "test_name": "Glucose",
        "value": 112,
        "unit": "mg/dL",
        "status": "HIGH",
        "reference_range": "70.0 - 99.0 mg/dL",
        "condition_context": "Diabetes-related monitoring",
        "explanation": (
            "Your glucose result is above the displayed "
            "reference range. Your doctor can interpret "
            "this together with other blood-sugar information."
        ),
        "doctor_discussion": (
            "Discuss this result with your doctor together "
            "with your medical history and other results."
        ),
        "disclaimer": (
            "HealthFlow provides educational information and "
            "does not provide a medical diagnosis."
        ),
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 3,
        "patient_id": 3,
        "test_name": "Creatinine",
        "value": 1.0,
        "unit": "mg/dL",
        "status": "NORMAL",
        "reference_range": "0.6 - 1.3 mg/dL",
        "condition_context": "Kidney health monitoring",
        "explanation": (
            "Your creatinine result is within the displayed "
            "reference range."
        ),
        "doctor_discussion": (
            "Discuss this result with your doctor together "
            "with your other health information."
        ),
        "disclaimer": (
            "HealthFlow provides educational information and "
            "does not provide a medical diagnosis."
        ),
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 4,
        "patient_id": 4,
        "test_name": "HbA1c",
        "value": 6.2,
        "unit": "%",
        "status": "HIGH",
        "reference_range": "4.0 - 5.6 %",
        "condition_context": "Diabetes-related monitoring",
        "explanation": (
            "Your HbA1c result is above the displayed "
            "reference range. HbA1c provides information "
            "about average blood glucose over a period of time."
        ),
        "doctor_discussion": (
            "Discuss this result with your doctor for "
            "appropriate clinical interpretation."
        ),
        "disclaimer": (
            "HealthFlow provides educational information and "
            "does not provide a medical diagnosis."
        ),
        "created_at": datetime.now().isoformat()
    },
    {
        "id": 5,
        "patient_id": 5,
        "test_name": "Hemoglobin",
        "value": 10.8,
        "unit": "g/dL",
        "status": "LOW",
        "reference_range": "12.0 - 15.0 g/dL",
        "condition_context": "Anemia",
        "explanation": (
            "Your hemoglobin level is below the displayed "
            "reference range. Hemoglobin helps carry oxygen "
            "through the body."
        ),
        "doctor_discussion": (
            "Discuss this result with your doctor because "
            "hemoglobin values can have different causes."
        ),
        "disclaimer": (
            "HealthFlow provides educational information and "
            "does not provide a medical diagnosis."
        ),
        "created_at": datetime.now().isoformat()
    }
]


NEXT_REPORT_ID = 6


# ============================================================
# REQUEST MODEL
# ============================================================

class LabAnalysisRequest(BaseModel):
    test_name: str
    value: float
    gender: str = "Unknown"
    patient_id: int = 10


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "HealthFlow API is running",
        "status": "healthy"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


# ============================================================
# PATIENT INFORMATION
# ============================================================

@app.get("/patients")
def get_patients():
    return {
        "total_patients": len(DEMO_PATIENTS),
        "patients": DEMO_PATIENTS
    }


@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):

    patient = next(
        (
            p for p in DEMO_PATIENTS
            if p["patient_id"] == patient_id
        ),
        None
    )

    if patient is None:
        return {
            "error": "Patient not found"
        }

    return patient


@app.get("/patients/token/{token}")
def get_patient_by_token(token: str):

    token = token.upper()

    patient = next(
        (
            p for p in DEMO_PATIENTS
            if p["token"] == token
        ),
        None
    )

    if patient is None:
        return {
            "error": "Patient not found"
        }

    return patient


# ============================================================
# OPD QUEUE
# ============================================================

@app.get("/opd/queue")
def get_opd_queue():

    waiting = [
        p for p in DEMO_PATIENTS
        if p["status"] == "Waiting"
    ]

    consulting = [
        p for p in DEMO_PATIENTS
        if p["status"] == "Consulting"
    ]

    completed = [
        p for p in DEMO_PATIENTS
        if p["status"] == "Completed"
    ]

    return {
        "department": "General Medicine",
        "patients": DEMO_PATIENTS,
        "total_patients": len(DEMO_PATIENTS),
        "waiting": len(waiting),
        "consulting": len(consulting),
        "completed": len(completed),
        "doctors_available": DOCTORS_AVAILABLE,
        "average_consultation_duration":
            AVERAGE_CONSULTATION_DURATION,
        "updated_at": datetime.now().isoformat()
    }


# ============================================================
# OPD PREDICTION
# ============================================================

@app.get("/opd/prediction/{token}")
def get_patient_prediction(token: str):

    token = token.upper()

    patient_index = next(
        (
            i
            for i, patient in enumerate(DEMO_PATIENTS)
            if patient["token"] == token
        ),
        None
    )

    if patient_index is None:
        return {
            "error": "Patient not found"
        }

    patient = DEMO_PATIENTS[patient_index]

    consulting = [
        p for p in DEMO_PATIENTS
        if p["status"] == "Consulting"
    ]

    if patient["status"] == "Completed":
        return {
            "token": token,
            "status": "Completed",
            "patients_ahead": 0,
            "doctors_available": DOCTORS_AVAILABLE,
            "average_consultation_duration":
                AVERAGE_CONSULTATION_DURATION,
            "patients_currently_being_served": 0,
            "estimated_waiting_time": 0,
            "confidence_level": "High"
        }

    if patient["status"] == "Consulting":
        return {
            "token": token,
            "status": "Consulting",
            "patients_ahead": 0,
            "doctors_available": DOCTORS_AVAILABLE,
            "average_consultation_duration":
                AVERAGE_CONSULTATION_DURATION,
            "patients_currently_being_served":
                len(consulting),
            "estimated_waiting_time": 0,
            "confidence_level": "High"
        }

    waiting_before = [
        p
        for p in DEMO_PATIENTS[:patient_index]
        if p["status"] == "Waiting"
    ]

    patients_ahead = len(waiting_before)

    effective_doctors = max(
        DOCTORS_AVAILABLE,
        1
    )

    estimated_wait = round(
        (
            patients_ahead
            * AVERAGE_CONSULTATION_DURATION
        )
        / effective_doctors
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
        "doctors_available": DOCTORS_AVAILABLE,
        "average_consultation_duration":
            AVERAGE_CONSULTATION_DURATION,
        "patients_currently_being_served":
            len(consulting),
        "estimated_waiting_time": estimated_wait,
        "confidence_level": confidence
    }


# ============================================================
# CALL NEXT PATIENT
# ============================================================

@app.post("/opd/call-next")
def call_next_patient():

    # Prevent two patients from being consulting
    # beyond the available doctor capacity.

    consulting_count = sum(
        1
        for p in DEMO_PATIENTS
        if p["status"] == "Consulting"
    )

    if consulting_count >= DOCTORS_AVAILABLE:
        return {
            "message": "All doctors are currently consulting",
            "patient": None
        }

    patient = next(
        (
            p
            for p in DEMO_PATIENTS
            if p["status"] == "Waiting"
        ),
        None
    )

    if patient is None:
        return {
            "message": "No waiting patients",
            "patient": None
        }

    patient["status"] = "Consulting"

    return {
        "message": "Next patient called",
        "patient": patient
    }


# ============================================================
# COMPLETE PATIENT
# ============================================================

@app.post("/opd/complete/{token}")
def complete_patient(token: str):

    token = token.upper()

    patient = next(
        (
            p
            for p in DEMO_PATIENTS
            if p["token"] == token
        ),
        None
    )

    if patient is None:
        return {
            "error": "Patient not found"
        }

    if patient["status"] == "Completed":
        return {
            "message": "Patient already completed",
            "patient": patient
        }

    patient["status"] = "Completed"

    return {
        "message": "Consultation completed",
        "patient": patient
    }


# ============================================================
# RESET DEMO QUEUE
# ============================================================

@app.post("/opd/reset")
def reset_opd_queue():

    statuses = [
        "Completed",
        "Completed",
        "Completed",
        "Completed",
        "Completed",
        "Consulting",
        "Waiting",
        "Waiting",
        "Waiting",
        "Waiting"
    ]

    for patient, status in zip(
        DEMO_PATIENTS,
        statuses
    ):
        patient["status"] = status

    return {
        "message": "Demo OPD queue reset successfully",
        "patients": DEMO_PATIENTS
    }


# ============================================================
# LAB REPORT ANALYSIS
# ============================================================

@app.post("/lab/analyze")
def analyze_lab_report(
    request: LabAnalysisRequest
):

    global NEXT_REPORT_ID

    test_name = request.test_name.strip().lower()
    value = request.value
    gender = request.gender.strip().lower()

    if test_name not in LAB_TESTS:
        return {
            "error": (
                "Test is not currently supported."
            )
        }

    if value < 0:
        return {
            "error": "Lab value cannot be negative."
        }

    test = LAB_TESTS[test_name]

    # --------------------------------------------------------
    # Reference range
    # --------------------------------------------------------

    if test_name == "hemoglobin":

        if gender == "male":
            low, high = test["male_range"]

        elif gender == "female":
            low, high = test["female_range"]

        else:
            low = min(
                test["male_range"][0],
                test["female_range"][0]
            )

            high = max(
                test["male_range"][1],
                test["female_range"][1]
            )

    else:
        low, high = test["range"]

    # --------------------------------------------------------
    # Status
    # --------------------------------------------------------

    if value < low:
        status = "LOW"
        explanation = test["low"]

    elif value > high:
        status = "HIGH"
        explanation = test["high"]

    else:
        status = "NORMAL"
        explanation = test["normal"]

    reference_range = (
        f"{low} - {high} {test['unit']}"
    )

    doctor_discussion = (
        "Discuss this result with your doctor. Your doctor "
        "can interpret it together with your symptoms, "
        "medical history and other laboratory results."
    )

    disclaimer = (
        "HealthFlow provides educational information to help "
        "patients understand laboratory terminology. It does "
        "not provide a diagnosis, disease prediction or "
        "treatment recommendation."
    )

    report = {
        "id": NEXT_REPORT_ID,
        "patient_id": request.patient_id,
        "test_name": request.test_name,
        "value": value,
        "unit": test["unit"],
        "status": status,
        "reference_range": reference_range,
        "condition_context": test["condition"],
        "explanation": explanation,
        "doctor_discussion": doctor_discussion,
        "disclaimer": disclaimer,
        "created_at": datetime.now().isoformat()
    }

    LAB_REPORTS.append(report)
    NEXT_REPORT_ID += 1

    return report


# ============================================================
# GET PATIENT LAB REPORTS
# ============================================================

@app.get("/lab/patient/{patient_id}")
def get_patient_lab_reports(
    patient_id: int
):

    reports = [
        report
        for report in LAB_REPORTS
        if report["patient_id"] == patient_id
    ]

    return {
        "patient_id": patient_id,
        "total_reports": len(reports),
        "reports": list(reversed(reports))
    }


# ============================================================
# GET ALL LAB REPORTS - DOCTOR
# ============================================================

@app.get("/lab/all")
def get_all_lab_reports():

    return {
        "total_reports": len(LAB_REPORTS),
        "reports": list(reversed(LAB_REPORTS))
    }


# ============================================================
# GET SUPPORTED LAB TESTS
# ============================================================

@app.get("/lab/tests")
def get_supported_lab_tests():

    tests = []

    for name, test in LAB_TESTS.items():

        if name == "hemoglobin":
            reference = {
                "male": (
                    f"{test['male_range'][0]} - "
                    f"{test['male_range'][1]} "
                    f"{test['unit']}"
                ),
                "female": (
                    f"{test['female_range'][0]} - "
                    f"{test['female_range'][1]} "
                    f"{test['unit']}"
                )
            }

        else:
            reference = (
                f"{test['range'][0]} - "
                f"{test['range'][1]} "
                f"{test['unit']}"
            )

        tests.append({
            "test_name": name,
            "unit": test["unit"],
            "reference_range": reference,
            "condition": test["condition"]
        })

    return {
        "total_tests": len(tests),
        "tests": tests
    }


# ============================================================
# ADMIN SUMMARY
# ============================================================

@app.get("/admin/summary")
def get_admin_summary():

    waiting = sum(
        1
        for p in DEMO_PATIENTS
        if p["status"] == "Waiting"
    )

    consulting = sum(
        1
        for p in DEMO_PATIENTS
        if p["status"] == "Consulting"
    )

    completed = sum(
        1
        for p in DEMO_PATIENTS
        if p["status"] == "Completed"
    )

    total = len(DEMO_PATIENTS)

    completion_rate = (
        round((completed / total) * 100)
        if total
        else 0
    )

    return {
        "total_patients": total,
        "waiting_patients": waiting,
        "consulting_patients": consulting,
        "completed_patients": completed,
        "completion_rate": completion_rate,
        "active_doctors": DOCTORS_AVAILABLE,
        "average_consultation_duration":
            AVERAGE_CONSULTATION_DURATION,
        "total_lab_reports": len(LAB_REPORTS),
        "updated_at": datetime.now().isoformat()
    }