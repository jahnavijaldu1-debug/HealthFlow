import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Droplets,
  FileText,
  HeartPulse,
  QrCode,
  Ticket,
  Wind,
  Loader2,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getPatient,
  getPatientPrediction,
  getPatientLabReports,
  getPatientAppointments,
  getStoredUser
} from '../../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [patient, setPatient] = useState(getStoredUser())
  const [prediction, setPrediction] = useState(null)
  const [labs, setLabs] = useState([])
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeReportModal, setActiveReportModal] = useState(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        const [patData, predData, labData, appData] = await Promise.all([
          getPatient(10).catch(() => getStoredUser()),
          getPatientPrediction('A-010').catch(() => ({ estimated_waiting_time: 24 })),
          getPatientLabReports(10).catch(() => ({ reports: [] })),
          getPatientAppointments(10).catch(() => [])
        ])

        if (patData) setPatient(patData)
        if (predData) setPrediction(predData)
        if (labData?.reports) setLabs(labData.reports)
        if (appData && appData.length > 0) setAppointment(appData[0])
      } catch (err) {
        console.error('Error loading dashboard data', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const stats = [
    {
      title: 'HealthFlow ID',
      value: patient?.healthflow_id || 'HF-2026-00142',
      icon: FileText
    },
    {
      title: 'Upcoming',
      value: appointment?.department || 'Cardiology',
      subtitle: appointment ? new Date(appointment.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today, 2:00 PM',
      icon: CalendarDays
    },
    {
      title: 'OPD Token',
      value: prediction?.token || 'A-010',
      badge: prediction?.status || 'Active',
      icon: Ticket
    },
    {
      title: 'Est. Waiting Time',
      value: prediction?.estimated_waiting_time !== undefined ? String(prediction.estimated_waiting_time) : '24',
      subtitle: 'mins',
      icon: Clock3
    }
  ]

  const firstName = patient?.name ? patient.name.split(' ')[0] : 'Rahul'
  const initials = patient?.name
    ? patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'RS'

  return (
    <div className="mx-auto max-w-[1600px]">

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Good morning, {firstName}
        </h2>

        <p className="mt-2 text-lg text-slate-500">
          Here's your health summary for today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map(({ title, value, subtitle, badge, icon: Icon }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2 text-slate-500">
              <Icon size={19} />
              <span className="text-sm font-semibold">
                {title}
              </span>

              {badge && (
                <span className="ml-auto rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">
                  {badge}
                </span>
              )}
            </div>

            <div className="text-2xl font-bold text-slate-900">
              {value}
            </div>

            {subtitle && (
              <div className="mt-1 text-sm text-slate-500">
                {subtitle}
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Patient + Vitals */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-12">

        {/* Patient profile */}
        <section className="xl:col-span-4 rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="text-xl font-bold">
              Patient Profile
            </h3>
          </div>

          <div className="space-y-6 p-6">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {initials}
              </div>

              <div>
                <h4 className="text-xl font-bold">
                  {patient?.name || 'Rahul Sharma'}
                </h4>

                <p className="text-sm text-slate-500">
                  {patient?.gender || 'Male'}, {patient?.age || 42} years
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Blood Group
                </p>

                <span className="inline-flex rounded bg-red-50 px-3 py-1 font-bold text-red-700">
                  {patient?.blood_group || 'O+'}
                </span>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Allergies
                </p>

                <span className="inline-flex rounded bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                  {patient?.allergies || 'Penicillin'}
                </span>
              </div>

            </div>

            <div className="border-t border-slate-100 pt-5">

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Emergency Contact
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {patient?.emergency_contact || 'Priya Sharma'}
                  </p>

                  <p className="text-sm text-slate-500">
                    Wife · {patient?.emergency_phone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Vitals */}
        <section className="xl:col-span-8 rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="text-xl font-bold">
              Recent Vitals
            </h3>

            <span className="text-sm text-slate-500">
              Recorded Today, 10:30 AM
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">

            <VitalCard
              icon={<HeartPulse size={19} />}
              title="Heart Rate"
              value="72"
              unit="bpm"
              status="Normal"
            />

            <VitalCard
              icon={<Activity size={19} />}
              title="Blood Pressure"
              value="120/80"
              unit="mmHg"
              status="Optimal"
            />

            <VitalCard
              icon={<Wind size={19} />}
              title="SpO2"
              value="98"
              unit="%"
              status="Normal"
            />

          </div>
        </section>

      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

        {/* Labs */}
        <section className="xl:col-span-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="text-xl font-bold">
              Recent Lab Results
            </h3>

            <button
              onClick={() => navigate('/patient/lab-reports')}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-500">
                    Test Name
                  </th>

                  <th className="p-4 text-sm font-semibold text-slate-500">
                    Date
                  </th>

                  <th className="p-4 text-sm font-semibold text-slate-500">
                    Status
                  </th>

                  <th className="p-4 text-right text-sm font-semibold text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {labs.length > 0 ? (
                  labs.slice(0, 3).map((report) => (
                    <LabRow
                      key={report.id}
                      name={report.test_name}
                      date={new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      status={report.status}
                      active={true}
                      onView={() => setActiveReportModal(report)}
                    />
                  ))
                ) : (
                  <>
                    <LabRow
                      name="Complete Blood Count (CBC)"
                      date="Aug 29, 2026"
                      status="NORMAL"
                      active
                      onView={() => navigate('/patient/records')}
                    />

                    <LabRow
                      name="Lipid Profile"
                      date="Aug 29, 2026"
                      status="Pending"
                      active={false}
                    />
                  </>
                )}

              </tbody>
            </table>

          </div>
        </section>

        {/* Quick actions */}
        <section className="xl:col-span-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="mb-4 text-xl font-bold">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">

            <QuickAction
              icon={<FileText size={22} />}
              label="View Records"
              onClick={() => navigate('/patient/records')}
            />

            <QuickAction
              icon={<QrCode size={22} />}
              label="Show QR"
              onClick={() => navigate('/patient/healthflow-id')}
            />

            <QuickAction
              primary
              icon={<Ticket size={22} />}
              label="Join OPD"
              onClick={() => navigate('/patient/opd-queue')}
            />

            <QuickAction
              icon={<ShieldIcon />}
              label="Consent History"
              onClick={() => navigate('/patient/consent')}
            />

          </div>

        </section>

      </div>

      {/* Lab Report Detail Modal */}
      {activeReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-bold text-slate-900">{activeReportModal.test_name}</h3>
              <button
                onClick={() => setActiveReportModal(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Result</p>
                  <p className="text-lg font-bold text-slate-900">{activeReportModal.value} {activeReportModal.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Reference Range</p>
                  <p className="text-sm font-semibold text-slate-700">{activeReportModal.reference_range}</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-bold text-blue-900">Simple Explanation</h4>
                <p className="mt-1 text-xs leading-5 text-blue-800">{activeReportModal.explanation || activeReportModal.plain_language_explanation}</p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                <h4 className="font-bold text-purple-900">Doctor Discussion</h4>
                <p className="mt-1 text-xs leading-5 text-purple-800">{activeReportModal.doctor_discussion}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveReportModal(null)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

function VitalCard({ icon, title, value, unit, status }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">

      <div className="mb-3 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm font-semibold">
          {title}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">
          {value}
        </span>

        <span className="text-sm text-slate-500">
          {unit}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-green-600">
        <CheckCircle2 size={16} />
        {status}
      </div>

    </div>
  )
}

function LabRow({ name, date, status, active, onView }) {
  const isNormal = status === 'NORMAL' || status === 'Final'
  return (
    <tr className="border-t border-slate-100">

      <td className="p-4 font-medium">
        {name}
      </td>

      <td className="p-4 text-slate-500">
        {date}
      </td>

      <td className="p-4">
        <span
          className={`rounded px-2 py-1 text-sm font-semibold ${
            isNormal
              ? 'bg-teal-50 text-teal-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status}
        </span>
      </td>

      <td className="p-4 text-right">
        <button
          onClick={onView}
          disabled={!active}
          className="text-sm font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-300"
        >
          View
        </button>
      </td>

    </tr>
  )
}

function QuickAction({ icon, label, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[110px] flex-col items-center justify-center gap-2 rounded-lg border p-4 transition ${
        primary
          ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-500 hover:bg-blue-50'
      }`}
    >
      {icon}
      <span className="text-center text-sm font-semibold">
        {label}
      </span>
    </button>
  )
}

function ShieldIcon() {
  return <Droplets size={22} />
}