import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function PatientLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">

      <Sidebar />

      <div className="min-h-screen md:ml-[280px]">
        <Header />

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}