import {
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  QrCode,
  Settings,
  ShieldCheck,
  Siren,
  X
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearStoredUser } from '../services/api'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/patient' },
  { label: 'Appointments', icon: CalendarDays, path: '/patient/appointments' },
  { label: 'OPD Queue', icon: ClipboardList, path: '/patient/opd-queue' },
  { label: 'Records', icon: FileText, path: '/patient/records' },
  { label: 'Lab Reports', icon: FlaskConical, path: '/patient/lab-reports' },
  { label: 'Consent', icon: ShieldCheck, path: '/patient/consent' },
  { label: 'Emergency', icon: Siren, path: '/patient/emergency' }
]

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate()

  function handleLogout() {
    clearStoredUser()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        {/* Logo & Mobile Close */}
        <div className="mb-8 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              HF
            </div>

            <div>
              <h1 className="text-xl font-bold text-blue-700">
                HealthFlow
              </h1>

              <p className="text-xs font-semibold tracking-wide text-slate-500">
                CLINICAL EXCELLENCE
              </p>
            </div>
          </div>

          {mobileOpen && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === '/patient'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
        <button
          onClick={() => {
            onClose()
            navigate('/patient/healthflow-id')
          }}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <QrCode size={19} />
          Show QR
        </button>

        <button
          onClick={() => {
            onClose()
            navigate('/patient/settings')
          }}
          className="flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-slate-200 bg-white shadow-sm md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}