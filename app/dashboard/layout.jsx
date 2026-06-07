'use client'

import { useState } from "react"
import Sidebar from "../components/ui/Sidebar"
import MobileNav from "../components/ui/MobileNav"
import BusquedaGlobal from "../components/ui/BusquedaGlobal"
import { RolProvider } from "../context/RolContext"

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <RolProvider>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
        <MobileNav onOpenSidebar={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="bg-slate-100/80 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-3">
            <div className="max-w-7xl mx-auto flex justify-end">
              <BusquedaGlobal />
            </div>
          </div>
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </RolProvider>
  )
}

