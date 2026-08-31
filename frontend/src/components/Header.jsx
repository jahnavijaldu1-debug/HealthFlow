import { Bell, CircleHelp, Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-8">

      <div className="flex items-center gap-4">

        <div className="relative hidden md:block md:w-[400px]">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search patients, records..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <span className="text-lg font-bold text-blue-700 md:hidden">
          HealthFlow
        </span>
      </div>

      <div className="flex items-center gap-3">

        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <CircleHelp size={20} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-blue-700">
          RS
        </div>

      </div>
    </header>
  )
}