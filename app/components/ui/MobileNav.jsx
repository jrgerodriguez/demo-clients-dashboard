'use client'

import { FiMenu, FiBarChart2 } from 'react-icons/fi'

export default function MobileNav({ onOpenSidebar }) {
  return (
    <header className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shrink-0">
          <FiBarChart2 className="text-white" size={16} />
        </div>
        <div>
          <p className="text-white font-bold text-xs leading-none tracking-tight">CRM Pro</p>
        </div>
      </div>
      
      <button 
        onClick={onOpenSidebar}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
      >
        <FiMenu size={22} />
      </button>
    </header>
  )
}
