import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import PatientLayout from './layouts/PatientLayout'

import PatientDashboard from './pages/patient/Dashboard'
import HealthFlowID from './pages/patient/HealthFlowID'
import Consent from './pages/patient/Consent'
import OPDQueue from './pages/patient/OPDQueue'
import Records from './pages/patient/Records'
import LabReports from './pages/patient/LabReports'

import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'


function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-3xl text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
          H
        </div>

        <h1 className="mt-5 text-4xl font-bold text-slate-900">
          HealthFlow
        </h1>

        <p className="mt-3 text-slate-500">
          Digital Healthcare Management Platform
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">

          <a
            href="/login?role=patient"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Patient
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Access your health records, lab reports and OPD queue.
            </p>
          </a>

          <a
            href="/login?role=doctor"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Doctor
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage consultations and the live OPD queue.
            </p>
          </a>

          <a
            href="/login?role=admin"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Admin
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Monitor hospital operations and patient flow.
            </p>
          </a>

        </div>

      </div>

    </div>
  )
}


function Login() {

  const params = new URLSearchParams(
    window.location.search
  )

  const role = params.get('role') || 'patient'

  const roleName =
    role === 'doctor'
      ? 'Doctor'
      : role === 'admin'
        ? 'Admin'
        : 'Patient'

  function handleLogin() {

    if (role === 'doctor') {
      window.location.href = '/doctor'
      return
    }

    if (role === 'admin') {
      window.location.href = '/admin'
      return
    }

    window.location.href = '/patient'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            H
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            HealthFlow Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login as {roleName}
          </p>

        </div>


        <div className="mt-7 space-y-4">

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {role === 'patient'
                ? 'HealthFlow ID'
                : 'User ID'}
            </label>

            <input
              type="text"
              placeholder={
                role === 'patient'
                  ? 'Enter HealthFlow ID'
                  : `Enter ${roleName} ID`
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login as {roleName}
          </button>

        </div>


        <div className="mt-6 text-center">

          <a
            href="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to HealthFlow
          </a>

        </div>

      </div>

    </div>
  )
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* Patient */}

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


        {/* Doctor */}

        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />


        {/* Admin */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* Unknown URL */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App