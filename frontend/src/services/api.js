const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// ------------------------------------------------------------
// AUTH & CURRENT USER HELPERS
// ------------------------------------------------------------

export function getStoredUser() {
  try {
    const userStr = localStorage.getItem('hf_user')
    if (userStr) return JSON.parse(userStr)
  } catch (e) {
    console.error('Error reading stored user', e)
  }
  return {
    id: 10,
    name: 'Rahul Sharma',
    healthflow_id: 'HF-2026-00142',
    role: 'patient',
    gender: 'Male',
    age: 42,
    blood_group: 'O+',
    allergies: 'Penicillin',
    phone: '+91 98765 12345',
    emergency_contact: 'Priya Sharma',
    emergency_phone: '+91 98765 43210'
  }
}

export function setStoredUser(user) {
  localStorage.setItem('hf_user', JSON.stringify(user))
}

export function clearStoredUser() {
  localStorage.removeItem('hf_user')
  localStorage.removeItem('hf_token')
}

export async function loginUser(role, credentials = {}) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role,
        patient_id: credentials.patient_id || 10,
        healthflow_id: credentials.healthflow_id || 'HF-2026-00142',
        username: credentials.username,
        password: credentials.password
      })
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    if (data.token) localStorage.setItem('hf_token', data.token)
    if (data.user) setStoredUser({ ...data.user, role: data.role })
    return data
  } catch (err) {
    // Fallback offline session
    let fallbackUser = {
      role,
      name: role === 'patient' ? 'Rahul Sharma' : role === 'doctor' ? 'Dr. Anil Kumar' : 'Hospital Admin',
      healthflow_id: 'HF-2026-00142',
      id: role === 'patient' ? 10 : 1
    }
    setStoredUser(fallbackUser)
    return { token: 'mock_token', role, user: fallbackUser }
  }
}

// ------------------------------------------------------------
// PATIENTS
// ------------------------------------------------------------

export async function getPatient(patientId = 10) {
  const response = await fetch(`${API_URL}/patients/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load patient profile')
  }
  return response.json()
}

export async function getPatients() {
  const response = await fetch(`${API_URL}/patients`)
  if (!response.ok) {
    throw new Error('Failed to load patients list')
  }
  return response.json()
}

export async function getPatientByToken(token) {
  const response = await fetch(`${API_URL}/patients/token/${token}`)
  if (!response.ok) {
    throw new Error('Failed to load patient by token')
  }
  return response.json()
}

// ------------------------------------------------------------
// OPD QUEUE
// ------------------------------------------------------------

export async function getOPDQueue() {
  const response = await fetch(`${API_URL}/opd/queue`)
  if (!response.ok) {
    throw new Error('Failed to load OPD queue')
  }
  return response.json()
}

export async function getPatientPrediction(token = 'A-010') {
  const response = await fetch(`${API_URL}/opd/prediction/${token}`)
  if (!response.ok) {
    throw new Error('Failed to load waiting prediction')
  }
  return response.json()
}

export async function joinOPDQueue(patientId = 10, name = 'Rahul Sharma', department = 'General Medicine') {
  const response = await fetch(`${API_URL}/opd/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id: patientId, name, department })
  })
  if (!response.ok) {
    throw new Error('Failed to join OPD queue')
  }
  return response.json()
}

export async function callNextPatient() {
  const response = await fetch(`${API_URL}/opd/call-next`, {
    method: 'POST'
  })
  if (!response.ok) {
    throw new Error('Failed to call next patient')
  }
  return response.json()
}

export async function completePatient(token) {
  const response = await fetch(`${API_URL}/opd/complete/${token}`, {
    method: 'POST'
  })
  if (!response.ok) {
    throw new Error('Failed to complete consultation')
  }
  return response.json()
}

export async function resetOPDQueue() {
  const response = await fetch(`${API_URL}/opd/reset`, {
    method: 'POST'
  })
  if (!response.ok) {
    throw new Error('Failed to reset OPD queue')
  }
  return response.json()
}

// ------------------------------------------------------------
// LAB REPORTS
// ------------------------------------------------------------

export async function analyzeLabReport(testName, value, gender = 'Unknown', patientId = 10) {
  const response = await fetch(`${API_URL}/lab/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_name: testName,
      value: Number(value),
      gender,
      patient_id: Number(patientId)
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to analyze lab report')
  }

  return response.json()
}

export async function getPatientLabReports(patientId = 10) {
  const response = await fetch(`${API_URL}/lab/patient/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load lab reports')
  }
  return response.json()
}

export async function getAllLabReports() {
  const response = await fetch(`${API_URL}/lab/all`)
  if (!response.ok) {
    throw new Error('Failed to load all lab reports')
  }
  return response.json()
}

export async function getSupportedLabTests() {
  const response = await fetch(`${API_URL}/lab/tests`)
  if (!response.ok) {
    throw new Error('Failed to load supported tests')
  }
  return response.json()
}

// ------------------------------------------------------------
// MEDICAL RECORDS
// ------------------------------------------------------------

export async function getPatientRecords(patientId = 10) {
  const response = await fetch(`${API_URL}/records/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load medical records')
  }
  return response.json()
}

export async function createMedicalRecord(data) {
  const response = await fetch(`${API_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create medical record')
  }
  return response.json()
}

// ------------------------------------------------------------
// CONSENT MANAGEMENT
// ------------------------------------------------------------

export async function getPatientConsents(patientId = 10) {
  const response = await fetch(`${API_URL}/consent/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load consent requests')
  }
  return response.json()
}

export async function checkPatientConsent(patientId = 10, requester = '') {
  const response = await fetch(`${API_URL}/consent/check/${patientId}?requester=${encodeURIComponent(requester)}`)
  if (!response.ok) {
    throw new Error('Failed to check patient consent')
  }
  return response.json()
}

export async function createConsentRequest(data) {
  const response = await fetch(`${API_URL}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to create consent request')
  }
  return response.json()
}

export async function updateConsentDecision(consentId, decision) {
  const response = await fetch(`${API_URL}/consent/${consentId}/decision?decision=${decision}`, {
    method: 'PATCH'
  })
  if (!response.ok) {
    throw new Error('Failed to update consent decision')
  }
  return response.json()
}

// ------------------------------------------------------------
// AUDIT LOGS
// ------------------------------------------------------------

export async function getPatientAuditLogs(patientId = 10) {
  const response = await fetch(`${API_URL}/audit/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load audit logs')
  }
  return response.json()
}

export async function createAuditLog(data) {
  const response = await fetch(`${API_URL}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to record audit log')
  }
  return response.json()
}

// ------------------------------------------------------------
// APPOINTMENTS
// ------------------------------------------------------------

export async function getPatientAppointments(patientId = 10) {
  const response = await fetch(`${API_URL}/appointments/${patientId}`)
  if (!response.ok) {
    throw new Error('Failed to load appointments')
  }
  return response.json()
}

export async function createAppointment(data) {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to book appointment')
  }
  return response.json()
}

// ------------------------------------------------------------
// DOCTORS
// ------------------------------------------------------------

export async function getDoctors() {
  const response = await fetch(`${API_URL}/doctors`)
  if (!response.ok) {
    throw new Error('Failed to load doctors')
  }
  return response.json()
}

export async function createDoctor(data) {
  const response = await fetch(`${API_URL}/doctors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error('Failed to add doctor')
  }
  return response.json()
}

export async function updateDoctorAvailability(doctorId, available) {
  const response = await fetch(`${API_URL}/doctors/${doctorId}/availability?available=${available}`, {
    method: 'PATCH'
  })
  if (!response.ok) {
    throw new Error('Failed to update doctor availability')
  }
  return response.json()
}

// ------------------------------------------------------------
// ADMIN SUMMARY
// ------------------------------------------------------------

export async function getAdminSummary() {
  const response = await fetch(`${API_URL}/admin/summary`)
  if (!response.ok) {
    throw new Error('Failed to load admin summary')
  }
  return response.json()
}