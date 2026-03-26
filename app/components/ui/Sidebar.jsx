'use client'
import { FiHome, FiUsers, FiCalendar, FiBarChart2, FiUserX } from 'react-icons/fi'
import Link from "next/link"
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard',           label: 'Dashboard',   icon: FiHome },
  { href: '/dashboard/clientes',  label: 'Clientes',    icon: FiUsers },
  { href: '/dashboard/calendario',label: 'Calendario',  icon: FiCalendar },
  { href: '/dashboard/clientes-inactivos', label: 'Inactivos', icon: FiUserX },
]


export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 flex flex-col min-h-screen shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Rest of the sidebar content remains same or slightly adjusted */}
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shrink-0">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none tracking-tight">CRM Pro</p>
              <p className="text-slate-400 text-xs mt-0.5">Sistema de Gestión</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            {/* <FiUserX size={20} /> Or some close icon, using FiUserX since it was already imported, but I'll add an X later if needed */}
          </button>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
            Menú Principal
          </p>

          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`)

            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700/60">
          <div className="rounded-lg bg-slate-800 px-4 py-3">
            <p className="text-slate-400 text-xs">Versión</p>
            <p className="text-slate-200 text-sm font-semibold mt-0.5">CRM Pro v1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

