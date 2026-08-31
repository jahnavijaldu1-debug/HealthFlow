import {
  ShieldCheck,
  Stethoscope,
  Building2,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('patient') // 'patient', 'doctor', 'admin'
  const [healthflowId, setHealthflowId] = useState('HF-2026-00142')
  const [username, setUsername] = useState('rahul.sharma@healthflow.org')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    if (e) e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginUser(role, {
        healthflow_id: healthflowId,
        username,
        password
      })

      if (role === 'patient') navigate('/patient')
      else if (role === 'doctor') navigate('/doctor')
      else navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function selectRole(newRole) {
    setRole(newRole)
    setError('')
    if (newRole === 'patient') {
      setHealthflowId('HF-2026-00142')
      setUsername('rahul.sharma@healthflow.org')
    } else if (newRole === 'doctor') {
      setUsername('dr.anil@healthflow.org')
    } else {
      setUsername('admin@healthflow.org')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb] p-6 text-slate-900">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            onClick={() => navigate('/')}
            className="mx-auto mb-3 flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-md transition hover:scale-105"
          >
            HF
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Sign In to HealthFlow
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Select your portal to access clinical and patient workflows
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Role Tabs */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => selectRole('patient')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                role === 'patient'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck size={16} />
              Patient
            </button>

            <button
              type="button"
              onClick={() => selectRole('doctor')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                role === 'doctor'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope size={16} />
              Doctor
            </button>

            <button
              type="button"
              onClick={() => selectRole('admin')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition ${
                role === 'admin'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={16} />
              Admin
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {role === 'patient' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  HealthFlow ID / Card Number
                </label>
                <input
                  type="text"
                  required
                  value={healthflowId}
                  onChange={e => setHealthflowId(e.target.value)}
                  placeholder="e.g. HF-2026-00142"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {role === 'patient' ? 'Email or Registered Phone' : 'Staff Email / Username'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="email@healthflow.org"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Security Password / OTP
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Enter {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="mb-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick 1-Click Demo Login
            </p>

            <button
              type="button"
              onClick={() => handleLogin()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <CheckCircle2 size={15} className="text-green-600" />
              Continue as {role === 'patient' ? 'Rahul Sharma (Patient)' : role === 'doctor' ? 'Dr. Anil Kumar (Doctor)' : 'Hospital Administrator'}
            </button>
          </div>

        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          HealthFlow Clinical System · Secure 256-bit Healthcare Infrastructure
        </p>

      </div>
    </div>
  )
}
