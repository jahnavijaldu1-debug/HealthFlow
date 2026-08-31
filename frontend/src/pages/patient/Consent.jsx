import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  LockKeyhole,
  ShieldCheck,
  XCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Consent() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-5xl">

      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Consent Management
            </h1>

            <p className="mt-1 text-slate-500">
              Control who can access your health information.
            </p>
          </div>
        </div>
      </div>

      {/* Active Request */}
      <section className="mb-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Access Request
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              CityCare Hospital
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cardiology Department · Dr. Ananya Rao
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Awaiting Consent
          </span>

        </div>

        {/* Requested data */}
        <div className="rounded-xl bg-slate-50 p-5">

          <h3 className="mb-4 font-bold text-slate-900">
            Requested information
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">

            <PermissionItem label="Patient Profile" />
            <PermissionItem label="Previous Medical Records" />
            <PermissionItem label="Lab Reports" />
            <PermissionItem label="Current Medications" />

          </div>

        </div>

        {/* Duration */}
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 p-4">

          <Clock3
            size={20}
            className="mt-0.5 text-blue-600"
          />

          <div>
            <p className="font-semibold text-slate-900">
              Requested duration
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Access will automatically expire after 24 hours.
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={() => alert('Demo: Consent approved')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <CheckCircle2 size={19} />
            Approve Access
          </button>

          <button
            onClick={() => alert('Demo: Access request denied')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <XCircle size={19} />
            Deny Request
          </button>

        </div>

      </section>

      {/* Security information */}
      <section className="grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <LockKeyhole size={20} />
          </div>

          <h2 className="text-lg font-bold">
            Time-limited access
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Approved healthcare providers receive access only to the
            information you authorize and only for the selected period.
          </p>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <h2 className="text-lg font-bold">
            Access history
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Every approved or denied request is recorded in the
            HealthFlow audit trail.
          </p>

        </div>

      </section>

      {/* Demo notice */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">

        <Clock3
          size={20}
          className="mt-0.5 text-amber-600"
        />

        <div>
          <p className="font-semibold text-amber-900">
            Demo environment
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Consent actions currently simulate the workflow.
            Backend authorization, expiry and audit persistence
            will be connected next.
          </p>
        </div>

      </div>

    </div>
  )
}

function PermissionItem({ label }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <CheckCircle2
        size={18}
        className="text-green-600"
      />

      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>
    </div>
  )
}