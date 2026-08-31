import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PatientLayout from './layouts/PatientLayout.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

import PatientDashboard from './pages/patient/Dashboard.jsx'
import HealthFlowID from './pages/patient/HealthFlowID.jsx'
import Consent from './pages/patient/Consent.jsx'
import OPDQueue from './pages/patient/OPDQueue.jsx'
import Records from './pages/patient/Records.jsx'
import LabReports from './pages/patient/LabReports.jsx'
import Appointments from './pages/patient/Appointments.jsx'
import Emergency from './pages/patient/Emergency.jsx'
import Settings from './pages/patient/Settings.jsx'

import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Landing & Authentication */}
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
          path="/patient/patients"
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
          path="/patient/queue"
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
          path="/patient/labs"
          element={
            <PatientLayout>
              <LabReports />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/appointments"
          element={
            <PatientLayout>
              <Appointments />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/emergency"
          element={
            <PatientLayout>
              <Emergency />
            </PatientLayout>
          }
        />

        <Route
          path="/patient/settings"
          element={
            <PatientLayout>
              <Settings />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App