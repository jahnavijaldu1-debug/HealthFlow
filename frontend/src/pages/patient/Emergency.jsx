import {
  ArrowLeft,
  Siren,
  Phone,
  AlertTriangle,
  HeartPulse,
  ShieldAlert,
  UserCheck
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatient, getStoredUser } from '../../services/api'

export default function Emergency() {
  const navigate = useNavigate()
  const [patient, setPatient] = useState(getStoredUser())

  useEffect(() => {
    getPatient(10).then(data => setPatient(data)).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-4xl">

      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-600 text-white">
          <Siren size={23} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Emergency Medical Profile
          </h1>
          <p className="mt-1 text-slate-500">
            Critical health data for first responders and immediate contacts.
          </p>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
          <div>
            <h3 className="font-bold text-red-900">First Responder Protocol Active</h3>
            <p className="mt-1 text-sm leading-6 text-red-800">
              In case of critical clinical emergencies, authorized emergency medical teams can access your essential blood profile, allergies, and emergency contact list.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Medical Info */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Critical Medical Flags</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Blood Group</p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-red-100 px-3.5 py-1.5 font-bold text-red-800">
                <HeartPulse size={16} />
                {patient?.blood_group || 'O+'} (Rh Positive)
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Severe Allergies</p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3.5 py-1.5 font-bold text-amber-800">
                <ShieldAlert size={16} />
                {patient?.allergies || 'Penicillin'}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Chronic Conditions</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Stage 1 Essential Hypertension</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-900">Primary Emergency Contact</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Contact Name & Relation</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{patient?.emergency_contact || 'Priya Sharma (Wife)'}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Phone Number</p>
              <p className="mt-1 text-lg font-bold text-blue-700">{patient?.emergency_phone || '+91 98765 43210'}</p>
            </div>

            <a
              href={`tel:${patient?.emergency_phone || '+919876543210'}`}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              <Phone size={18} />
              Call Emergency Contact
            </a>
          </div>
        </div>
      </div>

      {/* Emergency Facility Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-slate-900">Hospital Emergency Hotline</h3>
            <p className="text-sm text-slate-500">CityCare Central Trauma & Emergency Center</p>
          </div>

          <div className="flex gap-3">
            <a
              href="tel:108"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
            >
              <Phone size={16} />
              Ambulance (108)
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
