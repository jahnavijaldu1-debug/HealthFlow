import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PatientLayout from './layouts/PatientLayout.jsx'

import PatientDashboard from './pages/patient/Dashboard.jsx'
import HealthFlowID from './pages/patient/HealthFlowID.jsx'
import Consent from './pages/patient/Consent.jsx'
import OPDQueue from './pages/patient/OPDQueue.jsx'
import Records from './pages/patient/Records.jsx'
import LabReports from './pages/patient/LabReports.jsx'

import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

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

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Patient Portal */}
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

        {/* Doctor Portal */}
        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App