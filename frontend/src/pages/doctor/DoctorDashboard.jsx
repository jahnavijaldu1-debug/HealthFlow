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
  ChevronRight
} from 'lucide-react'
import { useEffect, useState } from 'react'

const API = 'http://127.0.0.1:8000'

export default function DoctorDashboard() {

  const [queue, setQueue] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [reports, setReports] = useState([])

  const [loading, setLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadQueue() {

    try {

      setLoading(true)
      setError('')

      const response = await fetch(`${API}/opd/queue`)

      if (!response.ok) {
        throw new Error()
      }

      const data = await response.json()

      setQueue(data)

    } catch {

      setError(
        'Unable to connect to the HealthFlow backend.'
      )

    } finally {

      setLoading(false)

    }
  }


  async function loadPatientReports(patient) {

    const patientNumber =
      parseInt(patient.token.split('-')[1]) || 10

    try {

      setReportsLoading(true)

      const response = await fetch(
        `${API}/lab/patient/${patientNumber}`
      )

      const data = await response.json()

      setReports(data.reports || [])

    } catch {

      setReports([])

    } finally {

      setReportsLoading(false)

    }
  }


  async function selectPatient(patient) {

    setSelectedPatient(patient)

    await loadPatientReports(patient)

  }


  async function callNextPatient() {

    try {

      setActionLoading(true)

      await fetch(
        `${API}/opd/call-next`,
        {
          method: 'POST'
        }
      )

      await loadQueue()

    } finally {

      setActionLoading(false)

    }
  }


  async function completePatient(token) {

    try {

      setActionLoading(true)

      await fetch(
        `${API}/opd/complete/${token}`,
        {
          method: 'POST'
        }
      )

      setSelectedPatient(null)
      setReports([])

      await loadQueue()

    } finally {

      setActionLoading(false)

    }
  }


  useEffect(() => {

    loadQueue()

    const interval = setInterval(
      loadQueue,
      10000
    )

    return () => clearInterval(interval)

  }, [])


  if (loading && !queue) {

    return (
      <div className="flex min-h-screen items-center justify-center">

        <div className="flex items-center gap-3 text-slate-500">

          <Loader2
            size={24}
            className="animate-spin"
          />

          Loading Doctor Dashboard...

        </div>

      </div>
    )

  }


  const patients = queue?.patients || []

  const waiting =
    patients.filter(
      patient => patient.status === 'Waiting'
    )

  const consulting =
    patients.filter(
      patient => patient.status === 'Consulting'
    )

  const completed =
    patients.filter(
      patient => patient.status === 'Completed'
    )


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

                Doctor Dashboard

              </p>

            </div>

          </div>


          <button
            onClick={loadQueue}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >

            <RefreshCw size={16} />

            Refresh

          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">

            General Medicine

          </h2>

          <p className="mt-1 text-slate-500">

            Manage today's OPD queue and patient information.

          </p>

        </div>


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


        {/* Queue + Patient */}

        <div className="grid gap-6 lg:grid-cols-5">


          {/* Queue */}

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

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-slate-800">

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

                    <StatusBadge
                      status={patient.status}
                    />

                    <ChevronRight
                      size={17}
                      className="text-slate-400"
                    />

                  </div>

                </button>

              ))}

            </div>


            <button
              onClick={callNextPatient}
              disabled={
                actionLoading ||
                waiting.length === 0
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {actionLoading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Users size={18} />
              )}

              Call Next Patient

            </button>

          </section>


          {/* Patient Details */}

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

                    Select a patient from the queue to view
                    their information and lab reports.

                  </p>

                </div>

              </div>

            ) : (

              <PatientPanel
                patient={selectedPatient}
                reports={reports}
                reportsLoading={reportsLoading}
                onComplete={() =>
                  completePatient(
                    selectedPatient.token
                  )
                }
                actionLoading={actionLoading}
              />

            )}

          </section>

        </div>

      </main>

    </div>

  )
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  title,
  value
}) {

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


/* ============================================================
   STATUS
============================================================ */

function StatusBadge({ status }) {

  const styles = {

    Waiting:
      'bg-amber-100 text-amber-700',

    Consulting:
      'bg-blue-100 text-blue-700',

    Completed:
      'bg-green-100 text-green-700'

  }

  return (

    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        'bg-slate-100 text-slate-600'
      }`}
    >

      {status}

    </span>

  )
}


/* ============================================================
   PATIENT PANEL
============================================================ */

function PatientPanel({
  patient,
  reports,
  reportsLoading,
  onComplete,
  actionLoading
}) {

  const patientNumber =
    patient.token.split('-')[1]


  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Patient */}

      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">

          <Users size={25} />

        </div>

        <div>

          <h3 className="text-xl font-bold text-slate-900">

            {patient.name}

          </h3>

          <p className="text-sm text-slate-500">

            Token A-{patientNumber}

          </p>

        </div>

      </div>


      {/* Status */}

      <div className="mt-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">

          Current Status

        </p>

        <div className="mt-2">

          <StatusBadge
            status={patient.status}
          />

        </div>

      </div>


      {/* Lab Reports */}

      <div className="mt-7">

        <div className="flex items-center gap-2">

          <FileText
            size={19}
            className="text-blue-600"
          />

          <h3 className="font-bold text-slate-900">

            Laboratory Reports

          </h3>

        </div>


        {reportsLoading ? (

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

            <Loader2
              size={17}
              className="animate-spin"
            />

            Loading reports...

          </div>

        ) : reports.length === 0 ? (

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">

            No laboratory reports available.

          </div>

        ) : (

          <div className="mt-4 space-y-3">

            {reports.map(report => (

              <ReportItem
                key={report.id}
                report={report}
              />

            ))}

          </div>

        )}

      </div>


      {/* Complete */}

      {patient.status === 'Consulting' && (

        <button
          onClick={onComplete}
          disabled={actionLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >

          {actionLoading ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={18} />
          )}

          Complete Consultation

        </button>

      )}

    </div>

  )
}


/* ============================================================
   REPORT ITEM
============================================================ */

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
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0 text-green-600"
          />
        ) : (
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-amber-600"
          />
        )}

        <p className="text-sm leading-5 text-slate-600">

          {report.explanation}

        </p>

      </div>

    </div>

  )
}