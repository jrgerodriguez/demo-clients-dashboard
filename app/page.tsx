import Link from 'next/link'
import { FiUsers, FiCalendar, FiBarChart2, FiArrowRight, FiCheckCircle, FiZap, FiShield } from 'react-icons/fi'

const features = [
  {
    icon: FiUsers,
    title: 'Gestión de Clientes',
    desc: 'Centraliza toda la información de tus clientes en un solo lugar. Historial, contactos y notas siempre a la mano.',
  },
  {
    icon: FiCalendar,
    title: 'Calendario de Citas',
    desc: 'Agenda, edita y visualiza todas tus citas con una vista semanal clara e intuitiva.',
  },
  {
    icon: FiBarChart2,
    title: 'Control de Ingresos',
    desc: 'Registra el costo de cada servicio y monitorea tus ingresos del mes en tiempo real.',
  },
  {
    icon: FiZap,
    title: 'Clientes Inactivos',
    desc: 'Identifica automáticamente qué clientes no han regresado en más de 30 días y no tienen cita futura.',
  },
]

const benefits = [
  'Sin hojas de cálculo ni papel',
  'Acceso desde cualquier dispositivo',
  'Información actualizada en tiempo real',
  'Historial completo por cliente',
  'Control de pagos y métodos',
  'Seguro y solo para tu equipo',
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
            <FiBarChart2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm">ClientesPro</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Iniciar sesión
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <FiShield size={12} />
          Sistema privado para tu negocio
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Administra tus clientes
          <br />
          <span className="text-blue-500">sin complicaciones</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Todo lo que necesitas para gestionar citas, clientes y cobros en una sola plataforma. Simple, rápido y siempre disponible.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 text-sm"
        >
          Comenzar ahora
          <FiArrowRight size={16} />
        </Link>

        {/* Mock dashboard preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-slate-900 to-transparent z-10 rounded-b-2xl" />
          <div className="bg-slate-800 rounded-2xl border border-slate-700/60 p-6 text-left shadow-2xl shadow-black/40 max-w-3xl mx-auto">
            {/* Fake top bar */}
            <div className="flex items-center gap-1.5 mb-5">
              <div className="w-3 h-3 rounded-full bg-slate-600" />
              <div className="w-3 h-3 rounded-full bg-slate-600" />
              <div className="w-3 h-3 rounded-full bg-slate-600" />
            </div>
            {/* Fake stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Total Clientes', value: '128', color: 'text-blue-400' },
                { label: 'Citas Hoy', value: '7', color: 'text-violet-400' },
                { label: 'Ingresos del Mes', value: '$2,840', color: 'text-green-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-slate-700/60 rounded-xl p-4 border border-slate-600/40">
                  <p className="text-slate-400 text-xs mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            {/* Fake list */}
            <div className="bg-slate-700/40 rounded-xl border border-slate-600/30 divide-y divide-slate-700/50">
              {['Ana García — Hoy 10:00 AM', 'Carlos Méndez — Hoy 11:30 AM', 'María López — Mañana 9:00 AM'].map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-7 h-7 rounded-full bg-slate-600 shrink-0" />
                  <div className="h-2.5 bg-slate-600 rounded-full flex-1" />
                  <div className="h-2 bg-slate-600/60 rounded-full w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-800/50 border-y border-slate-700/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-3">Todo en un solo lugar</h2>
          <p className="text-slate-400 text-center text-sm mb-12">Diseñado para negocios que valoran su tiempo</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-800 rounded-2xl border border-slate-700/60 p-6 hover:border-blue-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-blue-400" />
                </div>
                <h3 className="font-bold text-sm mb-2">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Olvídate del desorden</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Deja atrás las hojas de cálculo, los cuadernos y los grupos de WhatsApp. Con ClientesPro tienes todo organizado, seguro y accesible desde cualquier lugar.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-slate-300">
                  <FiCheckCircle size={16} className="text-blue-500 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800 rounded-2xl border border-slate-700/60 p-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Perfil de cliente</p>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl">A</div>
              <div>
                <p className="font-bold">Ana García</p>
                <p className="text-slate-400 text-xs mt-0.5">Cliente desde enero 2024</p>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {[
                { label: 'Teléfono', value: '+503 7890-1234' },
                { label: 'Última cita', value: '28 mayo, 2025' },
                { label: 'Total servicios', value: '14 citas' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm py-2 border-b border-slate-700/40">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-300">
              Próxima cita: Lunes 9 jun — 10:00 AM
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-blue-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-900/30">
          <h2 className="text-3xl font-bold mb-3">¿Listo para empezar?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
            Accede con tu cuenta autorizada y comienza a gestionar tus clientes hoy mismo.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition-all active:scale-95 text-sm"
          >
            Iniciar sesión
            <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <FiBarChart2 size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold">ClientesPro</span>
          </div>
          <p className="text-slate-600 text-xs">© 2025 ClientesPro. Todos los derechos reservados.</p>
        </div>
      </footer>

    </main>
  )
}
