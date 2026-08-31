import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Users,
  UserRound,
  Activity,
  TrendingUp,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getOPDQueue,
  getPatientPrediction,
  joinOPDQueue
} from '../../services/api'

export default function OPDQueue() {
  const navigate = useNavigate()

  const [queue, setQueue] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [patientToken, setPatientToken] = useState('A-010')

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [queueData, predictionData] = await Promise.all([
        getOPDQueue(),
        getPatientPrediction(patientToken)
      ])

      setQueue(queueData.patients || [])
      setPrediction(predictionData)
    } catch (err) {
      setError(err.message || 'Unable to connect to HealthFlow OPD service.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [patientToken])

  async function handleJoinQueue() {
    try {
      setLoading(true)
      const res = await joinOPDQueue(10, 'Rahul Sharma', 'General Medicine')
      if (res.patient?.token) {
        setPatientToken(res.patient.token)
      }
      await loadData()
    } catch (err) {
      setError('Failed to join OPD queue')
    } finally {
      setLoading(false)
    }
  }

  if (loading && queue.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={22} className="animate-spin text-blue-600" />
          Loading OPD queue...
        </div>
      </div>
    )
  }

  const patientsAhead = prediction?.patients_ahead ?? 0
  const activeDoctors = prediction?.doctors_available ?? 2
  const averageConsultation = prediction?.average_consultation_duration ?? 11
  const estimatedWait = prediction?.estimated_waiting_time ?? 0

  return (
    <div className="mx-auto max-w-6xl">

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
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin text-blue-600' : ''} />
            Refresh
          </button>
        </div>

      </div>

      <div className="mb-8 flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Users size={26} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            OPD Queue
          </h1>

          <p className="text-slate-500">
            Track your position and estimated waiting time.
          </p>
        </div>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mb-6 rounded-2xl border border-blue-200 bg-white p-8 shadow-sm">

        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Your OPD Token
        </p>

        <div className="mt-3 flex items-center gap-4">

          <div className="rounded-xl bg-blue-50 px-6 py-4">
            <p className="text-4xl font-bold text-blue-700">
              {patientToken}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span className="font-semibold">
                {prediction?.status || 'Active'}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              General Medicine · Consultation Session
            </p>
          </div>

        </div>

        <div className="mt-8">

          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">
              Queue progress
            </span>

            <span className="text-slate-500">
              {patientsAhead} patients ahead
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${Math.max(
                  10,
                  100 - patientsAhead * 10
                )}%`
              }}
            />
          </div>

        </div>

        <div className="mt-8 rounded-2xl bg-blue-50 p-6">

          <div className="flex items-center gap-2 text-blue-700">
            <Clock3 size={20} />
            <span className="font-semibold">
              Estimated Waiting Time
            </span>
          </div>

          <div className="mt-3 flex items-end gap-2">

            <span className="text-6xl font-bold text-slate-900">
              {estimatedWait}
            </span>

            <span className="mb-2 text-lg text-slate-500">
              mins
            </span>

          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
            <TrendingUp size={16} />
            Live estimate
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Current queue: {patientsAhead} patients ahead,
            {` ${activeDoctors}`} doctors available, average
            consultation {averageConsultation} minutes.
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-600">
            Confidence: {prediction?.confidence_level || 'High'}
          </p>

        </div>

      </section>

      <section className="mb-6">

        <h2 className="mb-4 text-xl font-bold">
          Prediction Factors
        </h2>

        <div className="grid gap-4 md:grid-cols-3">

          <FactorCard
            icon={<Users size={21} />}
            title="Patients Ahead"
            value={patientsAhead}
            subtitle="Currently waiting"
          />

          <FactorCard
            icon={<UserRound size={21} />}
            title="Active Doctors"
            value={activeDoctors}
            subtitle="Currently available"
          />

          <FactorCard
            icon={<Activity size={21} />}
            title="Avg. Consultation"
            value={`${averageConsultation} min`}
            subtitle="Department average"
          />

        </div>

      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Current Queue
            </h2>

            <p className="text-sm text-slate-500">
              General Medicine · Live queue
            </p>
          </div>

          <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
            Live
          </span>

        </div>

        <div className="space-y-3">

          {queue.map((patient) => (
            <QueueRow
              key={patient.token}
              token={patient.token}
              name={patient.name}
              status={
                patient.token === patientToken
                  ? 'You'
                  : patient.status
              }
              current={patient.token === patientToken}
            />
          ))}

        </div>

      </section>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">

        <h3 className="font-bold text-blue-900">
          Why is my wait estimated at {estimatedWait} minutes?
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-800">
          The estimate considers the current queue ({patientsAhead} waiting),
          active staffing ({activeDoctors} doctors available), patients currently being served,
          and the historical department average of {averageConsultation} minutes per consultation.
        </p>

      </div>

    </div>
  )
}

function FactorCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>

    </div>
  )
}

function QueueRow({ token, status, current }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        current
          ? 'border-blue-200 bg-blue-50'
          : 'border-slate-100 bg-slate-50'
      }`}
    >

      <div className="flex items-center gap-4">

        <div className="font-bold text-slate-800">
          {token}
        </div>

        {current && (
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
            YOU
          </span>
        )}

      </div>

      <span
        className={`text-sm font-semibold ${
          current
            ? 'text-blue-700'
            : status === 'Consulting'
              ? 'text-blue-600'
              : 'text-slate-500'
        }`}
      >
        {status}
      </span>

    </div>
  )
}