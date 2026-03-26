export default function BotonAccion({ icono: Icono, texto, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2.5 rounded-lg text-sm font-semibold
                 bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                 text-white flex items-center gap-2 justify-center
                 shadow-sm hover:shadow-md
                 transition-all duration-150
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
    >
      {Icono && <Icono className="w-4 h-4" />}
      <span>{texto}</span>
    </button>
  )
}