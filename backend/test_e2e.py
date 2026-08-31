from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all():
    print("Testing Root & Health...")
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("[OK] Root OK")

    print("Testing Auth Login (Patient)...")
    r = client.post("/auth/login", json={"role": "patient", "patient_id": 10})
    assert r.status_code == 200, f"Patient login failed: {r.text}"
    print("[OK] Patient Auth OK")

    print("Testing Patients API...")
    r = client.get("/patients")
    assert r.status_code == 200, f"Patients list failed: {r.text}"
    r = client.get("/patients/10")
    assert r.status_code == 200, f"Patient 10 failed: {r.text}"
    print("[OK] Patients API OK")

    print("Testing Doctors API...")
    r = client.get("/doctors")
    assert r.status_code == 200, f"Doctors failed: {r.text}"
    r = client.patch("/doctors/1/availability?available=true")
    assert r.status_code == 200, f"Doctor availability failed: {r.text}"
    print("[OK] Doctors API OK")

    print("Testing OPD Queue & Prediction...")
    r = client.get("/opd/queue")
    assert r.status_code == 200, f"OPD queue failed: {r.text}"
    r = client.get("/opd/prediction/A-010")
    assert r.status_code == 200, f"Prediction failed: {r.text}"
    r = client.post("/opd/call-next")
    assert r.status_code == 200, f"Call next failed: {r.text}"
    r = client.post("/opd/complete/A-006")
    assert r.status_code == 200, f"Complete failed: {r.text}"
    r = client.post("/opd/reset")
    assert r.status_code == 200, f"Reset queue failed: {r.text}"
    print("[OK] OPD Queue API OK")

    print("Testing Lab Reports & Analysis...")
    r = client.get("/lab/tests")
    assert r.status_code == 200, f"Lab tests failed: {r.text}"
    r = client.post("/lab/analyze", json={"test_name": "hemoglobin", "value": 14.5, "gender": "male", "patient_id": 10})
    assert r.status_code == 200, f"Lab analyze failed: {r.text}"
    r = client.get("/lab/patient/10")
    assert r.status_code == 200, f"Patient labs failed: {r.text}"
    print("[OK] Lab Reports API OK")

    print("Testing Medical Records API...")
    r = client.get("/records/10")
    assert r.status_code == 200, f"Records failed: {r.text}"
    r = client.post("/records", json={"patient_id": 10, "doctor_name": "Dr. Anil Kumar", "diagnosis": "Hypertension Test", "clinical_notes": "All clear"})
    assert r.status_code == 200, f"Create record failed: {r.text}"
    print("[OK] Medical Records API OK")

    print("Testing Consent API...")
    r = client.get("/consent/10")
    assert r.status_code == 200, f"Consents failed: {r.text}"
    r = client.get("/consent/check/10")
    assert r.status_code == 200, f"Consent check failed: {r.text}"
    r = client.patch("/consent/1/decision?decision=granted")
    assert r.status_code == 200, f"Consent decision failed: {r.text}"
    print("[OK] Consent API OK")

    print("Testing Audit Logs API...")
    r = client.get("/audit/10")
    assert r.status_code == 200, f"Audit logs failed: {r.text}"
    print("[OK] Audit Logs API OK")

    print("Testing Appointments API...")
    r = client.get("/appointments/10")
    assert r.status_code == 200, f"Appointments failed: {r.text}"
    print("[OK] Appointments API OK")

    print("Testing Admin Summary API...")
    r = client.get("/admin/summary")
    assert r.status_code == 200, f"Admin summary failed: {r.text}"
    print("[OK] Admin Summary API OK")

    print("\nALL 11 TEST SUITES PASSED CLEANLY WITH ZERO ERRORS!")

if __name__ == "__main__":
    test_all()
