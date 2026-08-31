import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Check,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, getPatientConsents } from '../../services/api'

export default function HealthFlowID() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser())
  const [copied, setCopied] = useState(false)
  const [activeConsent, setActiveConsent] = useState(null)
  const [timestamp, setTimestamp] = useState(Date.now())

  const healthFlowId = user?.healthflow_id || 'HF-2026-00142'
  const qrValue = `healthflow://access/${healthFlowId}?t=${timestamp}`

  useEffect(() => {
    async function loadConsentStatus() {
      try {
        const consents = await getPatientConsents(10)
        const active = consents.find(c => c.status === 'granted')
        setActiveConsent(active)
      } catch (err) {
        console.error('Error loading consent status', err)
      }
    }
    loadConsentStatus()
  }, [])

  function handleCopy() {
    navigator.clipboard?.writeText(healthFlowId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRefreshQR() {
    setTimestamp(Date.now())
  }

  return (
    <div className="mx-auto max-w-5xl">

      {/* Back */}
      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* Heading */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
            <QrCode size={23} />
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            HealthFlow ID
          </h1>
        </div>

        <p className="text-slate-500">
          Your secure healthcare identity for authorized record access.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* QR Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Your HealthFlow QR
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Scan this QR to initiate a secure access request.
            </p>
          </div>

          <div className="mx-auto mb-6 flex w-fit rounded-2xl border-8 border-slate-50 p-4 shadow-sm">
            <QRCodeSVG
              value={qrValue}
              size={230}
              level="H"
              includeMargin
            />
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              HealthFlow ID
            </p>

            <div className="mt-1 flex items-center justify-center gap-2">
              <p className="text-2xl font-bold tracking-wide text-blue-700">
                {healthFlowId}
              </p>
              <button
                onClick={handleCopy}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Copy HealthFlow ID"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <ShieldCheck size={18} />
              Secure identity token
            </div>

            <button
              onClick={handleRefreshQR}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={14} />
              Regenerate QR Token
            </button>
          </div>
        </section>

        {/* Security Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-slate-900">
            How access works
          </h2>

          <div className="space-y-5">

            <AccessStep
              number="1"
              title="Scan"
              description="A healthcare provider scans your HealthFlow QR."
            />

            <AccessStep
              number="2"
              title="Request"
              description="The provider submits a request for the required records."
            />

            <AccessStep
              number="3"
              title="Consent"
              description="You review what information is being requested."
            />

            <AccessStep
              number="4"
              title="Time-limited access"
              description="Approved access is available only for the authorized period."
            />

            <AccessStep
              number="5"
              title="Audit"
              description="The access event is recorded for transparency."
            />

          </div>

          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex gap-3">
              <LockKeyhole
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <h3 className="font-bold text-blue-900">
                  Your records are not stored in this QR
                </h3>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  The QR represents your secure HealthFlow identity.
                  Medical information is accessed only through the
                  authorized system.
                </p>
              </div>
            </div>

          </div>

        </section>
      </div>

      {/* Access status */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h2 className="font-bold text-slate-900">
              Current access status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {activeConsent
                ? `Active authorized session for ${activeConsent.requester_name} (${activeConsent.requester_role})`
                : 'No active external access requests.'}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            <CheckCircle2 size={17} />
            {activeConsent ? 'Authorized Session Active' : 'Protected'}
          </div>

        </div>

      </section>

      {/* Demo note */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">

        <Clock3
          size={20}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <div>
          <p className="font-semibold text-amber-900">
            Live HealthFlow Token
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            This QR contains your verified HealthFlow identifier linked to your patient record.
            When scanned by authorized clinical personnel, you will receive real-time consent verification requests.
          </p>
        </div>

      </div>

    </div>
  )
}

function AccessStep({ number, title, description }) {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  )
}