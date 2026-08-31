from datetime import datetime, timedelta
from app.database import Base, engine, SessionLocal
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
    db = SessionLocal()

    try:
        # Check if patients already exist
        if db.query(Patient).count() == 0:
            patients_data = [
                {
                    "id": 1,
                    "healthflow_id": "HF-2026-00001",
                    "name": "Rahul Sharma",
                    "age": 34,
                    "gender": "Male",
                    "blood_group": "A+",
                    "allergies": "None",
                    "phone": "+91 98000 00001",
                    "emergency_contact": "Anita Sharma (Sister)",
                    "emergency_phone": "+91 98000 10001"
                },
                {
                    "id": 2,
                    "healthflow_id": "HF-2026-00002",
                    "name": "Priya Reddy",
                    "age": 29,
                    "gender": "Female",
                    "blood_group": "B+",
                    "allergies": "Sulfa drugs",
                    "phone": "+91 98000 00002",
                    "emergency_contact": "Suresh Reddy (Spouse)",
                    "emergency_phone": "+91 98000 10002"
                },
                {
                    "id": 3,
                    "healthflow_id": "HF-2026-00003",
                    "name": "Arjun Kumar",
                    "age": 45,
                    "gender": "Male",
                    "blood_group": "O+",
                    "allergies": "Aspirin",
                    "phone": "+91 98000 00003",
                    "emergency_contact": "Sunita Kumar (Wife)",
                    "emergency_phone": "+91 98000 10003"
                },
                {
                    "id": 4,
                    "healthflow_id": "HF-2026-00004",
                    "name": "Sneha Rao",
                    "age": 38,
                    "gender": "Female",
                    "blood_group": "AB+",
                    "allergies": "None",
                    "phone": "+91 98000 00004",
                    "emergency_contact": "Ramesh Rao (Brother)",
                    "emergency_phone": "+91 98000 10004"
                },
                {
                    "id": 5,
                    "healthflow_id": "HF-2026-00005",
                    "name": "Vikram Singh",
                    "age": 52,
                    "gender": "Male",
                    "blood_group": "O-",
                    "allergies": "Peanuts",
                    "phone": "+91 98000 00005",
                    "emergency_contact": "Geeta Singh (Wife)",
                    "emergency_phone": "+91 98000 10005"
                },
                {
                    "id": 6,
                    "healthflow_id": "HF-2026-00006",
                    "name": "Ananya Das",
                    "age": 26,
                    "gender": "Female",
                    "blood_group": "A-",
                    "allergies": "None",
                    "phone": "+91 98000 00006",
                    "emergency_contact": "Deepak Das (Father)",
                    "emergency_phone": "+91 98000 10006"
                },
                {
                    "id": 7,
                    "healthflow_id": "HF-2026-00007",
                    "name": "Kiran Patel",
                    "age": 41,
                    "gender": "Male",
                    "blood_group": "B-",
                    "allergies": "Dust, Pollen",
                    "phone": "+91 98000 00007",
                    "emergency_contact": "Rita Patel (Wife)",
                    "emergency_phone": "+91 98000 10007"
                },
                {
                    "id": 8,
                    "healthflow_id": "HF-2026-00008",
                    "name": "Meena Joseph",
                    "age": 33,
                    "gender": "Female",
                    "blood_group": "O+",
                    "allergies": "None",
                    "phone": "+91 98000 00008",
                    "emergency_contact": "Thomas Joseph (Husband)",
                    "emergency_phone": "+91 98000 10008"
                },
                {
                    "id": 9,
                    "healthflow_id": "HF-2026-00009",
                    "name": "Rohit Verma",
                    "age": 30,
                    "gender": "Male",
                    "blood_group": "AB-",
                    "allergies": "Iodine",
                    "phone": "+91 98000 00009",
                    "emergency_contact": "Kavita Verma (Mother)",
                    "emergency_phone": "+91 98000 10009"
                },
                {
                    "id": 10,
                    "healthflow_id": "HF-2026-00142",
                    "name": "Rahul Sharma",
                    "age": 42,
                    "gender": "Male",
                    "blood_group": "O+",
                    "allergies": "Penicillin",
                    "phone": "+91 98765 12345",
                    "emergency_contact": "Priya Sharma (Wife)",
                    "emergency_phone": "+91 98765 43210"
                }
            ]

            for p_dict in patients_data:
                patient = Patient(**p_dict)
                db.add(patient)
            db.commit()
            print("Patients seeded.")

        # Check if doctors exist
        if db.query(Doctor).count() == 0:
            doctors_data = [
                {"name": "Dr. Anil Kumar", "specialization": "Consultant Physician", "department": "General Medicine", "phone": "+91 98111 00001", "email": "anil.kumar@healthflow.org", "is_available": 1},
                {"name": "Dr. Priya Sharma", "specialization": "Internal Medicine", "department": "General Medicine", "phone": "+91 98111 00002", "email": "priya.sharma@healthflow.org", "is_available": 1},
                {"name": "Dr. Ravi Reddy", "specialization": "Interventional Cardiologist", "department": "Cardiology", "phone": "+91 98111 00003", "email": "ravi.reddy@healthflow.org", "is_available": 1},
                {"name": "Dr. Meera Nair", "specialization": "Pediatrician", "department": "Pediatrics", "phone": "+91 98111 00004", "email": "meera.nair@healthflow.org", "is_available": 0},
                {"name": "Dr. Kiran Rao", "specialization": "Orthopedic Surgeon", "department": "Orthopedics", "phone": "+91 98111 00005", "email": "kiran.rao@healthflow.org", "is_available": 0},
            ]
            for doc in doctors_data:
                db.add(Doctor(**doc))
            db.commit()
            print("Doctors seeded.")

        # Check if medical records exist
        if db.query(MedicalRecord).count() == 0:
            records_data = [
                {
                    "patient_id": 10,
                    "doctor_name": "Dr. Ravi Reddy",
                    "department": "Cardiology",
                    "visit_type": "Consultation",
                    "clinical_notes": "Patient attended for cardiovascular follow-up. Blood pressure reading is 120/80 mmHg with resting pulse 72 bpm. Heart sounds S1, S2 audible, no murmurs detected.",
                    "diagnosis": "Normal Cardiovascular Assessment with Stage 1 Hypertension history",
                    "treatment": "Maintain balanced Mediterranean diet, regular moderate exercise (30 mins/day), routine yearly check-up."
                },
                {
                    "patient_id": 10,
                    "doctor_name": "Dr. Anil Kumar",
                    "department": "General Medicine",
                    "visit_type": "Annual Health Checkup",
                    "clinical_notes": "Routine annual wellness exam. Respiratory sounds clear, abdomen soft, neurological examination within normal limits.",
                    "diagnosis": "General Wellness & Preventive Examination",
                    "treatment": "Routine multivitamins, maintain hydration, monitor periodic blood glucose."
                }
            ]
            for r in records_data:
                db.add(MedicalRecord(**r))
            db.commit()
            print("Medical records seeded.")

        # Check if lab reports exist
        if db.query(LabReport).count() == 0:
            labs_data = [
                {
                    "patient_id": 10,
                    "test_name": "Hemoglobin",
                    "value": 14.2,
                    "unit": "g/dL",
                    "status": "NORMAL",
                    "reference_range": "13.0 - 17.0 g/dL",
                    "health_context": "Anemia",
                    "plain_language_explanation": "Your hemoglobin level is within the normal reference range. Hemoglobin carries oxygen to your body tissues.",
                    "doctor_discussion": "Discuss this result with your doctor during your next scheduled consultation."
                },
                {
                    "patient_id": 10,
                    "test_name": "Glucose",
                    "value": 92.0,
                    "unit": "mg/dL",
                    "status": "NORMAL",
                    "reference_range": "70.0 - 99.0 mg/dL",
                    "health_context": "Diabetes-related monitoring",
                    "plain_language_explanation": "Your fasting blood sugar is within the optimal reference range.",
                    "doctor_discussion": "Maintain your current healthy diet and physical activity habits."
                },
                {
                    "patient_id": 10,
                    "test_name": "Creatinine",
                    "value": 0.95,
                    "unit": "mg/dL",
                    "status": "NORMAL",
                    "reference_range": "0.6 - 1.3 mg/dL",
                    "health_context": "Kidney health monitoring",
                    "plain_language_explanation": "Your creatinine levels indicate healthy renal filtration function.",
                    "doctor_discussion": "Stay adequately hydrated and discuss any new supplements with your physician."
                },
                {
                    "patient_id": 10,
                    "test_name": "HbA1c",
                    "value": 5.3,
                    "unit": "%",
                    "status": "NORMAL",
                    "reference_range": "4.0 - 5.6 %",
                    "health_context": "Diabetes-related monitoring",
                    "plain_language_explanation": "Your average blood sugar over the past 90 days is well within the healthy non-diabetic range.",
                    "doctor_discussion": "Excellent glycemic control. Continue regular routine monitoring."
                }
            ]
            for l in labs_data:
                db.add(LabReport(**l))
            db.commit()
            print("Lab reports seeded.")

        # Check if consents exist
        if db.query(Consent).count() == 0:
            consents_data = [
                {
                    "patient_id": 10,
                    "requester_name": "CityCare Hospital",
                    "requester_role": "Cardiology Department - Dr. Ananya Rao",
                    "access_type": "Patient Profile, Medical Records, Lab Reports, Current Medications",
                    "status": "pending",
                    "expires_at": datetime.utcnow() + timedelta(hours=24)
                },
                {
                    "patient_id": 10,
                    "requester_name": "Metro Diagnostics Center",
                    "requester_role": "Laboratory Unit",
                    "access_type": "Lab Reports & Test Results",
                    "status": "granted",
                    "expires_at": datetime.utcnow() + timedelta(days=7)
                }
            ]
            for c in consents_data:
                db.add(Consent(**c))
            db.commit()
            print("Consents seeded.")

        # Check if audit logs exist
        if db.query(AuditLog).count() == 0:
            audit_data = [
                {
                    "patient_id": 10,
                    "actor_name": "Rahul Sharma (Patient)",
                    "actor_role": "Patient",
                    "action": "Portal Authentication",
                    "resource_type": "Session",
                    "details": "Authenticated using HealthFlow ID HF-2026-00142"
                },
                {
                    "patient_id": 10,
                    "actor_name": "Dr. Ravi Reddy",
                    "actor_role": "Doctor (Cardiology)",
                    "action": "Record Consultation View",
                    "resource_type": "MedicalRecord",
                    "details": "Reviewed patient history and vitals prior to consultation"
                },
                {
                    "patient_id": 10,
                    "actor_name": "CityCare Hospital",
                    "actor_role": "Hospital Department",
                    "action": "Consent Access Request",
                    "resource_type": "Consent",
                    "details": "Requested 24-hour access authorization for cardiology clinical review"
                }
            ]
            for a in audit_data:
                db.add(AuditLog(**a))
            db.commit()
            print("Audit logs seeded.")

        # Check if appointments exist
        if db.query(Appointment).count() == 0:
            app_data = [
                {
                    "patient_id": 10,
                    "doctor_name": "Dr. Ravi Reddy",
                    "department": "Cardiology",
                    "appointment_time": datetime.utcnow() + timedelta(hours=2),
                    "status": "scheduled",
                    "token_number": 47
                },
                {
                    "patient_id": 10,
                    "doctor_name": "Dr. Anil Kumar",
                    "department": "General Medicine",
                    "appointment_time": datetime.utcnow() + timedelta(days=2, hours=4),
                    "status": "scheduled",
                    "token_number": 12
                }
            ]
            for ap in app_data:
                db.add(Appointment(**ap))
            db.commit()
            print("Appointments seeded.")

    finally:
        db.close()

    print("HealthFlow database initialized and seeded successfully.")


if __name__ == "__main__":
    initialize_database()