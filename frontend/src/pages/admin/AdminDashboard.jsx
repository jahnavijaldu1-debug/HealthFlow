import {
  Users,
  UserRound,
  Stethoscope,
  Activity,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building2,
  BarChart3,
  Plus,
  RotateCcw,
  LogOut,
  X,
  Loader2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminSummary,
  getOPDQueue,
  getDoctors,
  updateDoctorAvailability,
  createDoctor,
  resetOPDQueue,
  clearStoredUser
} from '../../services/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [queue, setQueue] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [docName, setDocName] = useState('')
  const [docDept, setDocDept] = useState('General Medicine')
  const [docSpec, setDocSpec] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      const [sumData, queueData, docData] = await Promise.all([
        getAdminSummary().catch(() => null),
        getOPDQueue().catch(() => ({ patients: [] })),
        getDoctors().catch(() => [])
      ])

      if (sumData) setSummary(sumData)
      if (queueData?.patients) setQueue(queueData.patients)
      if (docData) setDoctors(docData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error loading admin data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  async function handleToggleDoctor(doctor) {
    try {
      setActionLoading(true)
      const newStatus = !doctor.is_available
      await updateDoctorAvailability(doctor.id, newStatus)
      await loadData()
      setMessage(`Updated ${doctor.name} availability to ${newStatus ? 'Available' : 'Offline'}`)
      setTimeout(() => setMessage(''), 3000)
    } catch {
      alert('Failed to update doctor availability')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleAddDoctor(e) {
    e.preventDefault()
    if (!docName) return
    try {
      setActionLoading(true)
      await createDoctor({
        name: docName,
        department: docDept,
        specialization: docSpec || 'Consultant',
        is_available: 1
      })
      setShowAddDoctor(false)
      setDocName('')
      setDocSpec('')
      setMessage(`Added ${docName} to clinical staff!`)
      await loadData()
      setTimeout(() => setMessage(''), 3000)
    } catch {
      alert('Failed to create doctor')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleResetQueue() {
    try {
      setActionLoading(true)
      await resetOPDQueue()
      setMessage('OPD queue reset to demonstration initial state!')
      await loadData()
      setTimeout(() => setMessage(''), 3000)
    } catch {
      alert('Failed to reset OPD queue')
    } finally {
      setActionLoading(false)
    }
  }

  const patients = queue
  const waiting = summary?.waiting_patients ?? patients.filter(p => p.status === 'Waiting').length
  const consulting = summary?.consulting_patients ?? patients.filter(p => p.status === 'Consulting').length
  const completed = summary?.completed_patients ?? patients.filter(p => p.status === 'Completed').length
  const total = patients.length || summary?.total_patients || 10
  const completionRate = summary?.completion_rate ?? (total ? Math.round((completed / total) * 100) : 0)

  const activeDoctors = doctors.filter(d => Boolean(d.is_available)).length || summary?.active_doctors || 2
  const totalDoctors = doctors.length || summary?.total_doctors || 5

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                HealthFlow
              </h1>

              <p className="text-sm text-slate-500">
                Hospital Administration Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetQueue}
              disabled={actionLoading}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:flex"
            >
              <RotateCcw size={15} />
              Reset Demo Queue
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin text-blue-600' : ''} />
              Refresh
            </button>

            <button
              onClick={() => {
                clearStoredUser()
                navigate('/login')
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              title="Sign Out"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3
                size={25}
                className="text-blue-600"
              />

              <h2 className="text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h2>
            </div>

            <p className="mt-2 text-slate-500">
              Monitor hospital operations, OPD activity, and real-time patient flow.
            </p>
          </div>

          <button
            onClick={() => setShowAddDoctor(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Doctor
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            {message}
          </div>
        )}

        {/* Main Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users size={21} />}
            title="Today's Patients"
            value={total}
            subtitle="OPD registrations"
          />

          <StatCard
            icon={<Stethoscope size={21} />}
            title="Active Doctors"
            value={`${activeDoctors}/${totalDoctors}`}
            subtitle="Currently available"
          />

          <StatCard
            icon={<Clock3 size={21} />}
            title="Waiting"
            value={waiting}
            subtitle="Patients in queue"
          />

          <StatCard
            icon={<CheckCircle2 size={21} />}
            title="Completed"
            value={completed}
            subtitle={`${completionRate}% completion rate`}
          />
        </div>

        {/* Operations */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">

          {/* OPD Overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Activity size={21} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  OPD Overview
                </h3>

                <p className="text-sm text-slate-500">
                  Current patient distribution
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <ProgressRow
                label="Completed"
                value={completed}
                total={total}
              />

              <ProgressRow
                label="Consulting"
                value={consulting}
                total={total}
              />

              <ProgressRow
                label="Waiting"
                value={waiting}
                total={total}
              />
            </div>
          </section>

          {/* Doctor Availability */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Stethoscope size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Doctor Availability
                  </h3>

                  <p className="text-sm text-slate-500">
                    Current hospital staffing
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-400">Click to toggle</span>
            </div>

            <div className="space-y-3">
              {doctors.length > 0 ? (
                doctors.map(doc => (
                  <DoctorRow
                    key={doc.id}
                    name={doc.name}
                    department={doc.department}
                    status={doc.is_available ? 'Available' : 'Offline'}
                    onToggle={() => handleToggleDoctor(doc)}
                  />
                ))
              ) : (
                <>
                  <DoctorRow
                    name="Dr. Anil Kumar"
                    department="General Medicine"
                    status="Available"
                  />
                  <DoctorRow
                    name="Dr. Priya Sharma"
                    department="General Medicine"
                    status="Available"
                  />
                  <DoctorRow
                    name="Dr. Ravi Reddy"
                    department="Cardiology"
                    status="Available"
                  />
                  <DoctorRow
                    name="Dr. Meera Nair"
                    department="Pediatrics"
                    status="Offline"
                  />
                </>
              )}
            </div>
          </section>

        </div>

        {/* Queue */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Today's Patient Queue
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Live OPD activity ({patients.length} total)
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
              Live
            </span>
          </div>

          <div className="space-y-3">
            {patients.map(patient => (
              <div
                key={patient.token}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-blue-700 shadow-xs">
                    {patient.token.split('-')[1]}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {patient.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Token {patient.token} · {patient.department || 'General Medicine'}
                    </p>
                  </div>
                </div>

                <Status status={patient.status} />
              </div>
            ))}
          </div>
        </section>

        {/* System Information */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<Users size={20} />}
            title="Patient Portal"
            text="HealthFlow ID, consent, records, lab reports and OPD queue."
          />

          <InfoCard
            icon={<Stethoscope size={20} />}
            title="Doctor Portal"
            text="Live queue management, consent-aware access, and clinical consultation records."
          />

          <InfoCard
            icon={<Activity size={20} />}
            title="AI/ML Layer"
            text="Lab simplification and intelligent OPD waiting-time prediction."
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span>
            HealthFlow Administration System
          </span>

          <span>
            Last updated{' '}
            {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

      </main>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Add Clinical Staff</h3>
              <button onClick={() => setShowAddDoctor(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Rao"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Department</label>
                <select
                  value={docDept}
                  onChange={e => setDocDept(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Consultant Physician"
                  value={docSpec}
                  onChange={e => setDocSpec(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctor(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  subtitle
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  )
}

function ProgressRow({
  label,
  value,
  total
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100)

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-slate-700">
          {label}
        </span>

        <span className="text-slate-500">
          {value} ({percentage}%)
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${percentage}%`
          }}
        />
      </div>
    </div>
  )
}

function DoctorRow({
  name,
  department,
  status,
  onToggle
}) {
  const available = status === 'Available'
  const consulting = status === 'Consulting'

  return (
    <div
      onClick={onToggle}
      className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-xs">
          <UserRound size={19} />
        </div>

        <div>
          <p className="font-semibold text-slate-800">
            {name}
          </p>

          <p className="text-xs text-slate-500">
            {department}
          </p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold transition ${
          available
            ? 'bg-green-100 text-green-700'
            : consulting
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-200 text-slate-600'
        }`}
      >
        {status}
      </span>
    </div>
  )
}

function Status({ status }) {
  if (status === 'Completed') {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
        <CheckCircle2 size={14} />
        Completed
      </span>
    )
  }

  if (status === 'Consulting') {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
        <Activity size={14} />
        Consulting
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
      <Clock3 size={14} />
      Waiting
    </span>
  )
}

function InfoCard({
  icon,
  title,
  text
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  )
}