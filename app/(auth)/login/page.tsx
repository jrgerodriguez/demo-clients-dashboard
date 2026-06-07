'use client'

import { Suspense, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FiUsers, FiShield, FiBarChart2 } from 'react-icons/fi'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'

const features = [
  { icon: FiUsers, text: 'Gestión de clientes' },
  { icon: FiCalendar, text: 'Calendario de citas' },
  { icon: FiBarChart2, text: 'Panel de control' },
]

function FiCalendar(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleGoogleLogin() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
  }

  return (
    <>
      {error === 'no_autorizado' && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-start gap-2">
          <FiShield size={16} className="shrink-0 mt-0.5" />
          Tu cuenta no tiene acceso al sistema. Contacta al administrador.
        </div>
      )}

      {error === 'auth_error' && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          Ocurrió un error al iniciar sesión. Intenta de nuevo.
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <FcGoogle size={20} />
        {loading ? 'Redirigiendo...' : 'Continuar con Google'}
      </button>
    </>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-800 p-12 border-r border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
            <FiBarChart2 className="text-white" size={18} />
          </div>
          <span className="text-white font-bold text-sm">ClientesPro</span>
        </div>

        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4">Sistema de gestión</p>
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Administra tus clientes en un solo lugar
          </h1>
          <div className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2025 ClientesPro. Todos los derechos reservados.</p>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-10">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <span className="text-white font-bold">ClientesPro</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Bienvenido</h2>
          <p className="text-slate-400 text-sm mb-8">Inicia sesión para continuar</p>

          <Suspense fallback={
            <div className="w-full py-3 rounded-xl bg-white/10 animate-pulse" />
          }>
            <LoginForm />
          </Suspense>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex-1 h-px bg-slate-700/60" />
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiShield size={12} />
              Solo usuarios autorizados
            </div>
            <div className="flex-1 h-px bg-slate-700/60" />
          </div>

          <p className="text-center text-xs text-slate-600 mt-8">
            Al continuar aceptas nuestros términos de uso y política de privacidad
          </p>

        </div>
      </div>

    </main>
  )
}
