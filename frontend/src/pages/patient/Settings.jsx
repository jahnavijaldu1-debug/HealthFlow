import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Save,
  Check
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, setStoredUser } from '../../services/api'

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser())
  const [name, setName] = useState(user?.name || 'Rahul Sharma')
  const [phone, setPhone] = useState(user?.phone || '+91 98765 12345')
  const [emergencyPhone, setEmergencyPhone] = useState(user?.emergency_phone || '+91 98765 43210')
  const [autoConsentExp, setAutoConsentExp] = useState('24')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    const updated = {
      ...user,
      name,
      phone,
      emergency_phone: emergencyPhone
    }
    setStoredUser(updated)
    setUser(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl">

      <button
        onClick={() => navigate('/patient')}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
          <SettingsIcon size={23} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your personal profile and security preferences.
          </p>
        </div>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
          <Check size={18} />
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Profile Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-900">Personal Information</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">HealthFlow ID</label>
              <input
                type="text"
                disabled
                value={user?.healthflow_id || 'HF-2026-00142'}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Emergency Contact Number</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Security & Consent Settings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-900">Consent & Privacy Defaults</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">Default Access Duration</label>
              <select
                value={autoConsentExp}
                onChange={e => setAutoConsentExp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-blue-500 sm:w-64"
              >
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (Recommended)</option>
                <option value="48">48 Hours</option>
                <option value="168">7 Days</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Authorized clinical sessions will automatically expire after this period.</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-800">Require 2-Factor Consent Confirmation</p>
                <p className="text-xs text-slate-500">Receive SMS verification prior to approving record sharing.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600" />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Save size={18} />
          Save Changes
        </button>

      </form>

    </div>
  )
}
