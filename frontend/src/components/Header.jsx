import { Bell, CircleHelp, Search, Menu, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, clearStoredUser, getPatientConsents } from '../services/api'

export default function Header({ onToggleMobileNav }) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [pendingConsentCount, setPendingConsentCount] = useState(1)
  const [user, setUser] = useState(getStoredUser())

  useEffect(() => {
    setUser(getStoredUser())
    async function checkNotifications() {
      try {
        const consents = await getPatientConsents(10)
        const pending = consents.filter(c => c.status === 'pending').length
        setPendingConsentCount(pending)
      } catch (e) {
        // Fallback to initial
      }
    }
    checkNotifications()
  }, [])

  function handleSearch(e) {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/patient/records')
    }
  }

  function handleLogout() {
    clearStoredUser()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'RS'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-8">

      <div className="flex items-center gap-3 md:gap-4">

        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileNav}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block md:w-[400px]">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search patients, records..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <span
          onClick={() => navigate('/patient')}
          className="cursor-pointer text-lg font-bold text-blue-700 md:hidden"
        >
          HealthFlow
        </span>
      </div>

      <div className="relative flex items-center gap-3">

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
            title="Notifications"
          >
            <Bell size={20} />
            {pendingConsentCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-900">Notifications</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/patient/consent')
                  }}
                  className="cursor-pointer rounded-xl bg-blue-50 p-3 transition hover:bg-blue-100"
                >
                  <div className="flex items-center gap-2 font-semibold text-blue-800">
                    <ShieldCheck size={16} />
                    Pending Consent Request
                  </div>
                  <p className="mt-1 text-xs text-blue-700">
                    CityCare Hospital has requested access to your laboratory records.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/patient/opd-queue')
                  }}
                  className="cursor-pointer rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <CheckCircle2 size={16} className="text-green-600" />
                    OPD Queue Active
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Token A-010 is currently active for General Medicine.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          onClick={() => navigate('/patient/settings')}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          title="Help & Info"
        >
          <CircleHelp size={20} />
        </button>

        {/* User Avatar Circle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-blue-700 transition hover:bg-blue-50"
            title="User Profile"
          >
            {initials}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="border-b border-slate-100 pb-3">
                <p className="font-bold text-slate-900">{user?.name || 'Rahul Sharma'}</p>
                <p className="text-xs text-slate-500">{user?.healthflow_id || 'HF-2026-00142'}</p>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/patient/healthflow-id')
                  }}
                  className="flex w-full rounded-lg px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
                >
                  HealthFlow ID / QR
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/patient/settings')
                  }}
                  className="flex w-full rounded-lg px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
                >
                  Settings & Preferences
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full rounded-lg px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}