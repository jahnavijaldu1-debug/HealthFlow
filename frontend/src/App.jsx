import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PatientLayout from './layouts/PatientLayout.jsx'

import PatientDashboard from './pages/patient/Dashboard'
import HealthFlowID from './pages/patient/HealthFlowID'
import Consent from './pages/patient/Consent'
import OPDQueue from './pages/patient/OPDQueue'
import Records from './pages/patient/Records'
import LabReports from './pages/patient/LabReports'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function Home() {
  return <h1>HealthFlow Home</h1>
}

function Login() {
  return <h1>HealthFlow Login</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/patient"
          element={
            <PatientLayout>
              <PatientDashboard />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/healthflow-id"
          element={
            <PatientLayout>
              <HealthFlowID />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/consent"
          element={
            <PatientLayout>
              <Consent />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/opd-queue"
          element={
            <PatientLayout>
              <OPDQueue />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/records"
          element={
            <PatientLayout>
              <Records />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/lab-reports"
          element={
            <PatientLayout>
              <LabReports />
            </PatientLayout>
          }
        />

        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App