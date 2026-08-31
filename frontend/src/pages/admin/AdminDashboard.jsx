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
  BarChart3
} from 'lucide-react'
import { useEffect, useState } from 'react'

const initialPatients = [
  { token: 'A-001', name: 'Rahul Sharma', status: 'Completed' },
  { token: 'A-002', name: 'Priya Reddy', status: 'Completed' },
  { token: 'A-003', name: 'Arjun Kumar', status: 'Completed' },
  { token: 'A-004', name: 'Sneha Rao', status: 'Completed' },
  { token: 'A-005', name: 'Vikram Singh', status: 'Consulting' },
  { token: 'A-006', name: 'Ananya Das', status: 'Waiting' },
  { token: 'A-007', name: 'Kiran Patel', status: 'Waiting' },
  { token: 'A-008', name: 'Meena Joseph', status: 'Waiting' },
  { token: 'A-009', name: 'Rohit Verma', status: 'Waiting' },
  { token: 'A-010', name: 'Divya Nair', status: 'Waiting' }
]

export default function AdminDashboard() {

  const [patients, setPatients] =
    useState(initialPatients)

  const [lastUpdated, setLastUpdated] =
    useState(new Date())

  const activeDoctors = 2
  const totalDoctors = 5

  const waiting =
    patients.filter(
      patient => patient.status === 'Waiting'
    ).length

  const consulting =
    patients.filter(
      patient => patient.status === 'Consulting'
    ).length

  const completed =
    patients.filter(
      patient => patient.status === 'Completed'
    ).length

  const completionRate =
    patients.length === 0
      ? 0
      : Math.round(
          (completed / patients.length) * 100
        )

  function refreshDashboard() {
    setPatients([...patients])
    setLastUpdated(new Date())
  }

  useEffect(() => {

    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 10000)

    return () => clearInterval(interval)

  }, [])

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
                Hospital Administration
              </p>

            </div>

          </div>

          <button
            onClick={refreshDashboard}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Heading */}
        <div className="mb-8">

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
            Monitor hospital operations, OPD activity
            and patient flow.
          </p>

        </div>


        {/* Main Statistics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Users size={21} />}
            title="Today's Patients"
            value={patients.length}
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
                total={patients.length}
              />

              <ProgressRow
                label="Consulting"
                value={consulting}
                total={patients.length}
              />

              <ProgressRow
                label="Waiting"
                value={waiting}
                total={patients.length}
              />

            </div>

          </section>


          {/* Doctor Availability */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

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


            <div className="space-y-3">

              <DoctorRow
                name="Dr. Anil Kumar"
                department="General Medicine"
                status="Consulting"
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

              <DoctorRow
                name="Dr. Kiran Rao"
                department="Orthopedics"
                status="Offline"
              />

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
                Live OPD activity
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

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-blue-700">
                    {patient.token.split('-')[1]}
                  </div>

                  <div>

                    <p className="font-semibold text-slate-800">
                      {patient.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      Token {patient.token}
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
            text="Live queue management and patient laboratory information."
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

    </div>
  )
}


/* ============================================================
   STAT CARD
============================================================ */

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


/* ============================================================
   PROGRESS
============================================================ */

function ProgressRow({
  label,
  value,
  total
}) {

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (value / total) * 100
        )

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
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  )
}


/* ============================================================
   DOCTOR ROW
============================================================ */

function DoctorRow({
  name,
  department,
  status
}) {

  const available =
    status === 'Available'

  const consulting =
    status === 'Consulting'

  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600">
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
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          available
            ? 'bg-green-100 text-green-700'
            : consulting
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-200 text-slate-500'
        }`}
      >
        {status}
      </span>

    </div>
  )
}


/* ============================================================
   STATUS
============================================================ */

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


/* ============================================================
   INFO CARD
============================================================ */

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