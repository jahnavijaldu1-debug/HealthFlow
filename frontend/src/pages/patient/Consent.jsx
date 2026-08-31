import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  LockKeyhole,
  ShieldCheck,
  XCircle,
  Loader2,
  RefreshCw,
  PlusCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getPatientConsents,
  updateConsentDecision,
  createConsentRequest,
  getPatientAuditLogs
} from '../../services/api'

export default function Consent() {
  const navigate = useNavigate()
  const [consents, setConsents] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      const [consentData, auditData] = await Promise.all([
        getPatientConsents(10).catch(() => []),
        getPatientAuditLogs(10).catch(() => [])
      ])
      setConsents(consentData)
      setAuditLogs(auditData)
    } catch (err) {
      console.error('Error loading consent data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDecision(consentId, decision) {
    try {
      setActionLoading(true)
      await updateConsentDecision(consentId, decision)
      setMessage(`Consent successfully ${decision === 'granted' ? 'approved' : decision === 'rejected' ? 'denied' : 'revoked'}!`)
      await loadData()
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage('Failed to update consent decision.')
    } finally {
      setActionLoading(false)
    }
  }

  async function simulateDoctorRequest() {
    try {
      setActionLoading(true)
      await createConsentRequest({
        patient_id: 10,
        requester_name: 'Metro Care Super Specialty',
        requester_role: 'Neurology Department · Dr. Vikas Gupta',
        access_type: 'Patient Profile, Medical Records, Lab Reports',
        duration_hours: 24
      })
      setMessage('New access request simulated from Metro Care Super Specialty!')
      await loadData()
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage('Failed to simulate access request.')
    } finally {
      setActionLoading(false)
    }
  }

  const activeRequest = consents.find(c => c.status === 'pending') || consents[0]

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

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between gap-3">
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

          <button
            onClick={simulateDoctorRequest}
            disabled={actionLoading}
            className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 sm:flex"
          >
            <PlusCircle size={15} />
            Simulate Request
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          {message}
        </div>
      )}

      {/* Active Request Card */}
      {activeRequest ? (
        <section className="mb-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Access Request #{activeRequest.id}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {activeRequest.requester_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {activeRequest.requester_role}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                activeRequest.status === 'pending'
                  ? 'bg-amber-50 text-amber-700'
                  : activeRequest.status === 'granted'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
              }`}
            >
              {activeRequest.status === 'pending'
                ? 'Awaiting Consent'
                : activeRequest.status === 'granted'
                  ? 'Access Granted'
                  : 'Access Rejected'}
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
                {activeRequest.status === 'granted'
                  ? `Active authorization valid until ${new Date(activeRequest.expires_at).toLocaleString()}`
                  : 'Access will automatically expire after 24 hours upon approval.'}
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            {activeRequest.status === 'pending' ? (
              <>
                <button
                  onClick={() => handleDecision(activeRequest.id, 'granted')}
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 size={19} className="animate-spin" /> : <CheckCircle2 size={19} />}
                  Approve Access
                </button>

                <button
                  onClick={() => handleDecision(activeRequest.id, 'rejected')}
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <XCircle size={19} />
                  Deny Request
                </button>
              </>
            ) : activeRequest.status === 'granted' ? (
              <button
                onClick={() => handleDecision(activeRequest.id, 'revoked')}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100"
              >
                <XCircle size={19} />
                Revoke Active Authorization
              </button>
            ) : (
              <button
                onClick={() => handleDecision(activeRequest.id, 'granted')}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <CheckCircle2 size={19} />
                Re-approve Access
              </button>
            )}

          </div>

        </section>
      ) : (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No active consent requests right now.</p>
        </section>
      )}

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
            Access history & audit
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Every approved, denied, or revoked request is recorded in the
            HealthFlow audit trail for full transparency.
          </p>

        </div>

      </section>

      {/* Access History List */}
      {auditLogs.length > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Audit Trail</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-sm">
                <div>
                  <p className="font-semibold text-slate-800">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.actor_name} ({log.actor_role}) · {log.details}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo notice */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">

        <Clock3
          size={20}
          className="mt-0.5 text-amber-600"
        />

        <div>
          <p className="font-semibold text-amber-900">
            Live Consent Authorization
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Consent state changes are persisted in the HealthFlow backend database.
            Authorized providers will immediately reflect active or revoked access status.
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