import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  Plus,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPatientAppointments, createAppointment } from '../../services/api'

export default function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [doctorName, setDoctorName] = useState('Dr. Ravi Reddy')
  const [department, setDepartment] = useState('Cardiology')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadAppointments() {
    try {
      setLoading(true)
      const data = await getPatientAppointments(10)
      setAppointments(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  async function handleBookAppointment(e) {
    e.preventDefault()
    try {
      setSubmitting(true)
      await createAppointment({
        patient_id: 10,
        doctor_name: doctorName,
        department,
        reason
      })
      setShowModal(false)
      setReason('')
      await loadAppointments()
    } catch (err) {
      alert('Failed to schedule appointment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/patient')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Book Consultation
          </button>

          <button
            onClick={loadAppointments}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
          <CalendarDays size={23} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Appointments
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your hospital visits and specialty consultations.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 size={22} className="animate-spin text-blue-600" />
              Loading appointments...
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <CalendarDays className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-bold text-slate-800">No Scheduled Appointments</h3>
            <p className="mt-1 text-sm text-slate-500">Book your next consultation with a department physician.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Book Consultation
            </button>
          </div>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{app.doctor_name}</h3>
                  <p className="text-sm text-slate-500">{app.department} Department</p>
                  {app.token_number && (
                    <p className="mt-1 text-xs font-semibold text-blue-600">Assigned Token: #{app.token_number}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <Clock3 size={15} className="text-slate-400" />
                    {new Date(app.appointment_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <p className="text-xs text-slate-500">{new Date(app.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <span className="rounded-full bg-green-50 px-3.5 py-1.5 text-xs font-bold text-green-700">
                  Confirmed
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Book OPD Consultation</h3>
              <button onClick={() => setShowModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Department</label>
                <select
                  value={department}
                  onChange={e => {
                    setDepartment(e.target.value)
                    if (e.target.value === 'Cardiology') setDoctorName('Dr. Ravi Reddy')
                    else if (e.target.value === 'General Medicine') setDoctorName('Dr. Anil Kumar')
                    else if (e.target.value === 'Pediatrics') setDoctorName('Dr. Meera Nair')
                    else setDoctorName('Dr. Kiran Rao')
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Physician</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Routine follow-up, symptom check"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Booking...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
