'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function SelectorAño({ año }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function cambiarAño(delta) {
    const params = new URLSearchParams(searchParams)
    params.set('año', año + delta)
    router.push(`${pathname}?${params.toString()}`)
  }

  const añoActual = new Date().getFullYear()

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <button
        onClick={() => cambiarAño(-1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-slate-800"
      >
        <FiChevronLeft size={16} />
      </button>
      <span className="px-3 text-sm font-bold text-slate-700 min-w-[52px] text-center">{año}</span>
      <button
        onClick={() => cambiarAño(1)}
        disabled={año >= añoActual}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  )
}
