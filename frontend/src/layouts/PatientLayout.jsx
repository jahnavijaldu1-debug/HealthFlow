import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function PatientLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">

      {/* Sidebar for Desktop and Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="min-h-screen md:ml-[280px]">
        <Header onToggleMobileNav={() => setMobileNavOpen(prev => !prev)} />

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}