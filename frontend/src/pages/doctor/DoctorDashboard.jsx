import {
  Users,
  Clock3,
  Activity,
  CheckCircle2,
  Stethoscope,
  FileText,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  Search,
  ShieldCheck,
  ShieldAlert,
  Plus,
  X,
  LogOut
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getOPDQueue,
  callNextPatient,
  completePatient,
  getPatientLabReports,
  getPatientRecords,
  checkPatientConsent,
  createConsentRequest,
  createMedicalRecord,
  getPatients,
  clearStoredUser
} from '../../services/api'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [reports, setReports] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [consentInfo, setConsentInfo] = useState({ has_active_consent: true })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [loading, setLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Add clinical note modal
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [diagnosis, setDiagnosis] = useState('')
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [treatment, setTreatment] = useState('')

  async function loadQueue() {
    try {
      setLoading(true)
      setError('')
      const data = await getOPDQueue()
      setQueue(data)
    } catch {
      setError('Unable to connect to the HealthFlow backend.')
    } finally {
      setLoading(false)
    }
  }

  async function loadPatientDetails(patient) {
    const patientNumber = parseInt(patient.token?.split('-')[1]) || patient.patient_id || patient.id || 10

    try {
      setReportsLoading(true)
      const [consentRes, labRes, recordRes] = await Promise.all([
        checkPatientConsent(patientNumber, 'General Medicine').catch(() => ({ has_active_consent: true })),
        getPatientLabReports(patientNumber).catch(() => ({ reports: [] })),
        getPatientRecords(patientNumber).catch(() => [])
      ])

      setConsentInfo(consentRes)
      setReports(labRes.reports || [])
      setMedicalRecords(recordRes || [])
    } catch {
      setReports([])
      setMedicalRecords([])
    } finally {
      setReportsLoading(false)
    }
  }

  async function selectPatient(patient) {
    setSelectedPatient(patient)
    await loadPatientDetails(patient)
  }

  async function handleCallNext() {
    try {
      setActionLoading(true)
      const res = await callNextPatient()
      if (res.patient) {
        await selectPatient(res.patient)
        setMessage(`Called ${res.patient.name} for consultation`)
      } else {
        setMessage(res.message || 'No patients waiting')
      }
      await loadQueue()
      setTimeout(() => setMessage(''), 4000)
    } catch {
      setError('Failed to call next patient')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleComplete(token) {
    try {
      setActionLoading(true)
      await completePatient(token)
      setSelectedPatient(null)
      setReports([])
      setMedicalRecords([])
      setMessage(`Consultation completed for token ${token}`)
      await loadQueue()
      setTimeout(() => setMessage(''), 4000)
    } catch {
      setError('Failed to complete consultation')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleRequestConsent() {
    if (!selectedPatient) return
    const pId = parseInt(selectedPatient.token?.split('-')[1]) || selectedPatient.patient_id || 10
    try {
      setActionLoading(true)
      await createConsentRequest({
        patient_id: pId,
        requester_name: 'Dr. Anil Kumar',
        requester_role: 'General Medicine Department',
        access_type: 'Patient Profile, Medical Records, Lab Reports',
        duration_hours: 24
      })
      setMessage('Consent request sent to patient mobile/portal!')
      await loadPatientDetails(selectedPatient)
      setTimeout(() => setMessage(''), 4000)
    } catch {
      setError('Failed to send consent request')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSaveNote(e) {
    e.preventDefault()
    if (!selectedPatient) return
    const pId = parseInt(selectedPatient.token?.split('-')[1]) || selectedPatient.patient_id || 10

    try {
      setActionLoading(true)
      await createMedicalRecord({
        patient_id: pId,
        doctor_name: 'Dr. Anil Kumar',
        department: 'General Medicine',
        visit_type: 'OPD Consultation',
        diagnosis,
        clinical_notes: clinicalNotes,
        treatment
      })
      setShowNoteModal(false)
      setDiagnosis('')
      setClinicalNotes('')
      setTreatment('')
      setMessage('Clinical record saved to patient file!')
      await loadPatientDetails(selectedPatient)
      setTimeout(() => setMessage(''), 4000)
    } catch {
      setError('Failed to save medical note')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSearch(query) {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    try {
      const allPatients = await getPatients()
      const filtered = (allPatients.patients || []).filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.healthflow_id.toLowerCase().includes(query.toLowerCase()) ||
        String(p.id).includes(query)
      )
      setSearchResults(filtered)
    } catch {
      setSearchResults([])
    }
  }

  useEffect(() => {
    loadQueue()
    const interval = setInterval(loadQueue, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !queue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={24} className="animate-spin text-blue-600" />
          Loading Doctor Dashboard...
        </div>
      </div>
    )
  }

  const patients = queue?.patients || []
  const waiting = patients.filter(patient => patient.status === 'Waiting')
  const consulting = patients.filter(patient => patient.status === 'Consulting')
  const completed = patients.filter(patient => patient.status === 'Completed')

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Stethoscope size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                HealthFlow
              </h1>

              <p className="text-sm text-slate-500">
                Doctor Dashboard · Dr. Anil Kumar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadQueue}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-blue-600' : ''} />
              Refresh
            </button>

            <button
              onClick={() => {
                clearStoredUser()
                navigate('/login')
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
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
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              General Medicine
            </h2>

            <p className="mt-1 text-slate-500">
              Manage today's OPD queue, consent-aware records, and patient consultations.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name, ID or token..."
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {searchResults.length > 0 && (
              <div className="absolute right-0 top-12 z-50 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      selectPatient({ patient_id: p.id, token: `A-${p.id.toString().padStart(3, '0')}`, name: p.name, status: 'Registered' })
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-sm hover:bg-blue-50"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.healthflow_id} · {p.gender}, {p.age}y</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard
            icon={<Users size={21} />}
            title="Total Patients"
            value={patients.length}
          />

          <StatCard
            icon={<Clock3 size={21} />}
            title="Waiting"
            value={waiting.length}
          />

          <StatCard
            icon={<Activity size={21} />}
            title="Consulting"
            value={consulting.length}
          />

          <StatCard
            icon={<CheckCircle2 size={21} />}
            title="Completed"
            value={completed.length}
          />
        </div>

        {/* Queue + Patient Details */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Queue List */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  OPD Queue
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Live patient queue
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                LIVE
              </span>
            </div>

            <div className="space-y-3">
              {patients.map(patient => (
                <button
                  key={patient.token}
                  onClick={() => selectPatient(patient)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:border-blue-200 ${
                    selectedPatient?.token === patient.token
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-slate-800 shadow-xs">
                      {patient.token.split('-')[1]}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {patient.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        Token {patient.token}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={patient.status} />
                    <ChevronRight size={17} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCallNext}
              disabled={actionLoading || waiting.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Users size={18} />
              )}
              Call Next Patient
            </button>
          </section>

          {/* Patient Details & Records */}
          <section className="lg:col-span-2">
            {!selectedPatient ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Users size={26} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    Select a Patient
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Select a patient from the queue to view their information, consent status, and lab reports.
                  </p>
                </div>
              </div>
            ) : (
              <PatientPanel
                patient={selectedPatient}
                reports={reports}
                medicalRecords={medicalRecords}
                consentInfo={consentInfo}
                reportsLoading={reportsLoading}
                onComplete={() => handleComplete(selectedPatient.token)}
                onRequestConsent={handleRequestConsent}
                onOpenNoteModal={() => setShowNoteModal(true)}
                actionLoading={actionLoading}
              />
            )}
          </section>

        </div>

      </main>

      {/* Add Consultation Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Record Consultation</h3>
                <p className="text-xs text-slate-500">Patient: {selectedPatient?.name} (Token {selectedPatient?.token})</p>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Clinical Assessment / Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute bronchitis, Routine hypertension follow-up"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Clinical Findings & Observations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter vitals, symptoms, physical examination findings..."
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Prescription / Treatment Plan</label>
                <textarea
                  rows={2}
                  placeholder="Enter medications, dosage, follow-up advice..."
                  value={treatment}
                  onChange={e => setTreatment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save & Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Waiting: 'bg-amber-100 text-amber-700',
    Consulting: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700'
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

function PatientPanel({
  patient,
  reports,
  medicalRecords,
  consentInfo,
  reportsLoading,
  onComplete,
  onRequestConsent,
  onOpenNoteModal,
  actionLoading
}) {
  const patientNumber = patient.token?.split('-')[1] || patient.patient_id || patient.id || 10
  const hasConsent = consentInfo?.has_active_consent !== false

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Patient Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <Users size={25} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {patient.name}
            </h3>

            <p className="text-sm text-slate-500">
              Token {patient.token || `A-${patientNumber}`}
            </p>
          </div>
        </div>

        <StatusBadge status={patient.status || 'Active'} />
      </div>

      {/* Consent Status Notification */}
      <div className="mt-5">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            {hasConsent ? (
              <ShieldCheck size={16} className="text-green-600" />
            ) : (
              <ShieldAlert size={16} className="text-amber-600" />
            )}
            <span>Consent Status: {hasConsent ? 'Authorized' : 'Awaiting Authorization'}</span>
          </div>

          {!hasConsent && (
            <button
              onClick={onRequestConsent}
              disabled={actionLoading}
              className="rounded-lg bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Request Consent
            </button>
          )}
        </div>
      </div>

      {/* Clinical Notes Action */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={onOpenNoteModal}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
        >
          <Plus size={15} />
          Record Clinical Diagnosis
        </button>
      </div>

      {/* Laboratory Reports */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={19} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Laboratory Reports</h3>
          </div>

          <span className="text-xs text-slate-400">({reports.length} available)</span>
        </div>

        {reportsLoading ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 size={17} className="animate-spin text-blue-600" />
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No laboratory reports available for this patient.
          </div>
        ) : (
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {reports.map(report => (
              <ReportItem key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* Complete Button */}
      {patient.status === 'Consulting' && (
        <button
          onClick={onComplete}
          disabled={actionLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {actionLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle2 size={18} />
          )}
          Complete Consultation
        </button>
      )}

    </div>
  )
}

function ReportItem({ report }) {
  const normal = report.status === 'NORMAL'

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">
            {report.test_name}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {report.value} {report.unit}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            normal
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {report.status}
        </span>
      </div>

      <div className="mt-3 rounded-lg bg-white p-3">
        <p className="text-xs font-semibold text-slate-400">
          Reference Range
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {report.reference_range}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        {normal ? (
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-green-600" />
        ) : (
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-amber-600" />
        )}

        <p className="text-sm leading-5 text-slate-600">
          {report.explanation || report.plain_language_explanation}
        </p>
      </div>
    </div>
  )
}