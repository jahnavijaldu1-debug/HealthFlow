import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  Loader2,
  Stethoscope,
  Plus,
  X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getPatientLabReports,
  getPatientRecords,
  createMedicalRecord
} from '../../services/api'

export default function Records() {
  const navigate = useNavigate()

  const [reports, setReports] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [activeTab, setActiveTab] = useState('labs') // 'labs' or 'clinical'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newDiagnosis, setNewDiagnosis] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newDoctor, setNewDoctor] = useState('Dr. Anil Kumar')
  const [newDept, setNewDept] = useState('General Medicine')
  const [submitting, setSubmitting] = useState(false)

  const patientId = 10

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [labData, recData] = await Promise.all([
        getPatientLabReports(patientId).catch(() => ({ reports: [] })),
        getPatientRecords(patientId).catch(() => [])
      ])

      setReports(labData.reports || [])
      setMedicalRecords(recData || [])
    } catch (err) {
      setError(
        'Unable to load your medical records. Please make sure the HealthFlow backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAddRecord(e) {
    e.preventDefault()
    if (!newDiagnosis) return
    try {
      setSubmitting(true)
      await createMedicalRecord({
        patient_id: patientId,
        doctor_name: newDoctor,
        department: newDept,
        visit_type: 'Clinical Consultation',
        diagnosis: newDiagnosis,
        clinical_notes: newNotes,
        treatment: 'Standard clinical management'
      })
      setShowAddModal(false)
      setNewDiagnosis('')
      setNewNotes('')
      await loadData()
    } catch (err) {
      alert('Failed to save medical note')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">

      {/* Back */}
      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileText size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Medical Records
            </h1>

            <p className="mt-1 text-slate-500">
              View your laboratory reports and HealthFlow analysis.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Note
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Refresh
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('labs')}
          className={`border-b-2 px-4 py-2.5 text-sm font-bold transition ${
            activeTab === 'labs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Lab Reports ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('clinical')}
          className={`border-b-2 px-4 py-2.5 text-sm font-bold transition ${
            activeTab === 'clinical'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Clinical Visits ({medicalRecords.length})
        </button>
      </div>

      {/* Summary */}
      <section className="mb-6 grid gap-4 md:grid-cols-3">

        <SummaryCard
          title="Total Reports"
          value={reports.length}
          icon={<FileText size={21} />}
        />

        <SummaryCard
          title="Normal Results"
          value={
            reports.filter(
              report => report.status === 'NORMAL'
            ).length
          }
          icon={<CheckCircle2 size={21} />}
        />

        <SummaryCard
          title="Needs Discussion"
          value={
            reports.filter(
              report => report.status !== 'NORMAL'
            ).length
          }
          icon={<MessageCircle size={21} />}
        />

      </section>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2
              size={22}
              className="animate-spin text-blue-600"
            />
            Loading your records...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && activeTab === 'labs' && reports.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FileText size={26} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No Lab Reports Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your analyzed laboratory reports will appear here.
          </p>

          <button
            onClick={() => navigate('/patient/lab-reports')}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Analyze a Lab Report
          </button>

        </div>
      )}

      {/* Lab Reports Tab */}
      {!loading && activeTab === 'labs' && reports.length > 0 && (
        <section className="space-y-5">

          {reports.map(report => (
            <LabReportCard
              key={report.id}
              report={report}
            />
          ))}

        </section>
      )}

      {/* Clinical Visits Tab */}
      {!loading && activeTab === 'clinical' && (
        <section className="space-y-5">
          {medicalRecords.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Stethoscope className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-600 font-semibold">No clinical visit notes on record.</p>
            </div>
          ) : (
            medicalRecords.map(rec => (
              <article key={rec.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{rec.diagnosis || 'Clinical Consultation'}</h2>
                    <p className="text-xs text-slate-500">{rec.doctor_name || 'Consultant'} · {rec.department || 'General Medicine'}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {formatDate(rec.created_at)}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Clinical Notes</p>
                    <p className="mt-1 leading-6 text-slate-700">{rec.clinical_notes || 'Routine examination completed.'}</p>
                  </div>

                  {rec.treatment && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Treatment Plan</p>
                      <p className="mt-1 leading-6 text-slate-700">{rec.treatment}</p>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {/* Add Clinical Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">Add Clinical Note</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Diagnosis / Assessment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypertension review, Routine checkup"
                  value={newDiagnosis}
                  onChange={e => setNewDiagnosis(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Doctor</label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={e => setNewDoctor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-slate-700">Clinical Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter observation, symptoms, and plan..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon
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

    </div>
  )
}

function LabReportCard({ report }) {
  const isNormal = report.status === 'NORMAL'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={22} />
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {report.test_name}
            </h2>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <Clock size={13} />

              {formatDate(report.created_at)}
            </div>

          </div>

        </div>

        <StatusBadge status={report.status} />

      </div>

      {/* Values */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">

        <InfoBox
          title="Result"
          value={`${report.value} ${report.unit}`}
        />

        <InfoBox
          title="Reference Range"
          value={report.reference_range}
        />

        <InfoBox
          title="Health Context"
          value={report.condition_context || 'General'}
        />

      </div>

      {/* Explanation */}
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="font-bold text-blue-900">
          Simple Explanation
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-800">
          {report.explanation || report.plain_language_explanation}
        </p>

      </div>

      {/* Doctor discussion */}
      <div className="mt-4 flex gap-3 rounded-xl border border-purple-100 bg-purple-50 p-5">

        <MessageCircle
          size={20}
          className="mt-0.5 shrink-0 text-purple-600"
        />

        <div>

          <h3 className="font-bold text-purple-900">
            Discuss With Your Doctor
          </h3>

          <p className="mt-1 text-sm leading-6 text-purple-800">
            {report.doctor_discussion}
          </p>

        </div>

      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs leading-5 text-slate-400">
        HealthFlow provides educational information only.
        This result is not a diagnosis or treatment recommendation.
      </p>

    </article>
  )
}

function InfoBox({
  title,
  value
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 font-bold text-slate-800">
        {value}
      </p>

    </div>
  )
}

function StatusBadge({ status }) {
  const normal = status === 'NORMAL'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
        normal
          ? 'bg-green-100 text-green-700'
          : 'bg-amber-100 text-amber-700'
      }`}
    >

      {normal ? (
        <CheckCircle2 size={14} />
      ) : (
        <AlertCircle size={14} />
      )}

      {status}

    </span>
  )
}

function formatDate(date) {
  if (!date) {
    return 'Recently analyzed'
  }

  return new Date(date).toLocaleString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
}