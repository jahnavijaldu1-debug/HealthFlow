import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Records() {
  const navigate = useNavigate()

  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const patientId = 10

  async function loadReports() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `http://127.0.0.1:8000/lab/patient/${patientId}`
      )

      if (!response.ok) {
        throw new Error('Failed to load reports')
      }

      const data = await response.json()

      setReports(data.reports || [])
    } catch (err) {
      setError(
        'Unable to load your lab reports. Please make sure the HealthFlow backend is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

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
      <div className="mb-8 flex items-center justify-between">

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

        <button
          onClick={loadReports}
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
              className="animate-spin"
            />
            Loading your records...
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && reports.length === 0 && (
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

      {/* Reports */}
      {!loading && reports.length > 0 && (
        <section className="space-y-5">

          {reports.map(report => (
            <LabReportCard
              key={report.id}
              report={report}
            />
          ))}

        </section>
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
          {report.explanation}
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