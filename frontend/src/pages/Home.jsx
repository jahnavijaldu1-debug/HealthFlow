import {
  ShieldCheck,
  Stethoscope,
  Building2,
  QrCode,
  FlaskConical,
  Clock3,
  ArrowRight,
  HeartPulse,
  LockKeyhole,
  CheckCircle2,
  Users
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { setStoredUser } from '../services/api'

export default function Home() {
  const navigate = useNavigate()

  function quickLogin(role) {
    if (role === 'patient') {
      setStoredUser({
        id: 10,
        name: 'Rahul Sharma',
        healthflow_id: 'HF-2026-00142',
        role: 'patient',
        gender: 'Male',
        age: 42,
        blood_group: 'O+',
        allergies: 'Penicillin',
        emergency_contact: 'Priya Sharma',
        emergency_phone: '+91 98765 43210'
      })
      navigate('/patient')
    } else if (role === 'doctor') {
      setStoredUser({
        id: 1,
        name: 'Dr. Anil Kumar',
        role: 'doctor',
        department: 'General Medicine',
        specialization: 'Consultant Physician'
      })
      navigate('/doctor')
    } else {
      setStoredUser({
        id: 1,
        name: 'Hospital Administrator',
        role: 'admin',
        facility: 'CityCare Central Hospital'
      })
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-xs">
            HF
          </div>

          <div>
            <h1 className="text-xl font-bold text-blue-700">
              HealthFlow
            </h1>
            <p className="text-[10px] font-bold tracking-wider text-slate-400">
              CLINICAL EXCELLENCE PLATFORM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign In
          </button>

          <button
            onClick={() => quickLogin('patient')}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Enter Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
          <HeartPulse size={16} />
          Unified Clinical & Patient Healthcare Ecosystem
        </div>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Intelligent Healthcare, <br />
          <span className="text-blue-600">Consent-Driven</span> & Transparent
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          HealthFlow connects patients, doctors, and hospital administrators in a unified, secure platform featuring QR-based identity, time-limited consent, AI lab report simplification, and live OPD queue intelligence.
        </p>

        {/* Portal Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">

          {/* Patient Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ShieldCheck size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Patient Portal
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage your HealthFlow ID, dynamic QR code, consent authorizations, live OPD queue tracking, and educational lab report analysis.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  HealthFlow ID & Dynamic QR
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Time-Limited Consent Control
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Educational Lab Simplification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Live OPD Queue & Wait Time
                </li>
              </ul>
            </div>

            <button
              onClick={() => quickLogin('patient')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Open Patient Portal
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Doctor Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Stethoscope size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Doctor Portal
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Real-time OPD queue management, calling next waiting patients, consent-aware medical record access, and consultation recording.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Live Queue & Next Patient Calling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Consent-Aware Patient Search
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Laboratory History Review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Clinical Diagnosis Recording
                </li>
              </ul>
            </div>

            <button
              onClick={() => quickLogin('doctor')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Open Doctor Portal
              <ArrowRight size={17} />
            </button>
          </div>

          {/* Admin Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                Admin Portal
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hospital administration, OPD operational overview, doctor staffing availability toggles, patient queue management, and system metrics.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Hospital Operational KPI Dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Physician Availability Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  OPD Queue Tracking & Resets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-green-600" />
                  Staffing & Audit Overview
                </li>
              </ul>
            </div>

            <button
              onClick={() => quickLogin('admin')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open Admin Portal
              <ArrowRight size={17} />
            </button>
          </div>

        </div>
      </section>

      {/* Feature Pillars */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <QrCode size={20} />
              </div>
              <h3 className="font-bold text-slate-900">HealthFlow ID</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Secure QR identity eliminates misplaced paperwork and enables time-limited provider authorizations.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <LockKeyhole size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Consent Governance</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Patients approve or deny access requests with automatic 24-hour expiration and transparent audit trails.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Clock3 size={20} />
              </div>
              <h3 className="font-bold text-slate-900">OPD Queue Prediction</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Live waiting time estimation factoring department queue position, active doctors, and average consultation times.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <FlaskConical size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Lab Simplification</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Educational plain-language explanations of laboratory metrics without medical diagnostic overreach.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
        <p>HealthFlow Healthcare Platform &copy; 2026. All rights reserved.</p>
      </footer>

    </div>
  )
}
