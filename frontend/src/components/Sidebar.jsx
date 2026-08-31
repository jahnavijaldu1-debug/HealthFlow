import {
  Activity,
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
  Users
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/patient' },
  { label: 'Patients', icon: Users, path: '/patient/patients' },
  { label: 'Appointments', icon: CalendarDays, path: '/patient/appointments' },
  { label: 'OPD Queue', icon: ClipboardList, path: '/patient/queue' },
  { label: 'Records', icon: FileText, path: '/patient/records' },
  { label: 'Lab Reports', icon: FlaskConical, path: '/patient/labs' },
  { label: 'Consent', icon: ShieldCheck, path: '/patient/consent' },
  { label: 'Emergency', icon: Siren, path: '/patient/emergency' }
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-[280px] flex-col border-r border-slate-200 bg-white p-4 shadow-sm">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-4">
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

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === '/patient'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">

        <button
          onClick={() => navigate('/patient/healthflow-id')}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <QrCode size={19} />
          Show QR
        </button>

        <button
          onClick={() => navigate('/patient/settings')}
          className="flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}