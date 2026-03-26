'use client'

import { useState, useRef, useEffect } from 'react'
import { FiClock, FiCheck } from 'react-icons/fi'

export default function CircularClock({ value, onChange, label = "Hora" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('hour') // 'hour' | 'minute'
  const containerRef = useRef(null)
  
  // displayValue is what the user sees on the button
  const [displayValue, setDisplayValue] = useState(value || '09:00')

  // Internal staging state
  const [h, m] = (displayValue).split(':').map(Number)
  const [hour, setHour] = useState(h % 12 || 12)
  const [minute, setMinute] = useState(m)
  const [ampm, setAmpm] = useState(h >= 12 ? 'PM' : 'AM')

  // Sync internal state when displayValue changes externally
  useEffect(() => {
    setDisplayValue(value || '09:00')
    const [nh, nm] = (value || '09:00').split(':').map(Number)
    setHour(nh % 12 || 12)
    setMinute(nm)
    setAmpm(nh >= 12 ? 'PM' : 'AM')
  }, [value])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        // Reset internal state to displayValue on close without confirming
        const [nh, nm] = (displayValue).split(':').map(Number)
        setHour(nh % 12 || 12)
        setMinute(nm)
        setAmpm(nh >= 12 ? 'PM' : 'AM')
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [displayValue])

  const handleConfirm = () => {
    let finalHour = hour === 12 ? 0 : hour
    if (ampm === 'PM') finalHour += 12
    const timeStr = `${finalHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    setDisplayValue(timeStr)
    onChange(timeStr)
    setIsOpen(false)
  }

  const toggleAmpm = () => {
    setAmpm(prev => prev === 'AM' ? 'PM' : 'AM')
  }

  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minuteNumbers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  const numbers = mode === 'hour' ? hourNumbers : minuteNumbers

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 w-full px-4 py-3 bg-white border rounded-xl text-sm cursor-pointer transition-all shadow-sm
          ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <FiClock className="text-slate-400" size={18} />
        <span className="font-bold text-slate-700">
           {displayValue.split(':')[0].padStart(2, '0')}:{displayValue.split(':')[1]} {parseInt(displayValue.split(':')[0]) >= 12 ? 'PM' : 'AM'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[70] p-5 sm:p-6 w-[280px] fade-in-up">
          {/* Display Staging */}
          <div className="flex items-center justify-center gap-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <button 
              type="button"
              onClick={() => setMode('hour')}
              className={`text-4xl font-bold transition-all px-2 py-1 rounded-xl ${mode === 'hour' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
            >
              {hour.toString().padStart(2, '0')}
            </button>
            <span className="text-3xl font-bold text-slate-300">:</span>
            <button 
               type="button"
               onClick={() => setMode('minute')}
               className={`text-4xl font-bold transition-all px-2 py-1 rounded-xl ${mode === 'minute' ? 'text-blue-600 bg-white shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
            >
              {minute.toString().padStart(2, '0')}
            </button>
            <div className="ml-4 flex flex-col gap-1.5">
              <button 
                type="button"
                onClick={toggleAmpm}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${ampm === 'AM' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
              >
                AM
              </button>
              <button 
                type="button"
                onClick={toggleAmpm}
                className={`text-[10px] font-black px-3 py-1.5 rounded-lg transition-all ${ampm === 'PM' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Clock Face */}
          <div className="relative w-56 h-56 mx-auto bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center shadow-inner">
            {/* Center point */}
            <div className="absolute w-2 h-2 bg-blue-600 rounded-full z-10 border-2 border-white" />
            
            {/* Hand */}
            {(() => {
                const clockValue = mode === 'hour' ? (hour % 12) : (minute / 5)
                const angle = (clockValue * 30) - 90
                return (
                    <div 
                        className="absolute w-1/2 h-1 bg-blue-600 origin-left transition-transform duration-300" 
                        style={{ transform: `rotate(${angle}deg)`, left: '50%' }}
                    >
                        <div className="absolute right-0 w-10 h-10 -top-[18px] bg-blue-600/10 border-2 border-blue-600 rounded-full shadow-sm" />
                    </div>
                )
            })()}

            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30) - 90
              const rad = (angle * Math.PI) / 180
              const x = 90 * Math.cos(rad) // Radius increased to 90
              const y = 90 * Math.sin(rad)
              
              if (mode === 'minute') {
                  const min = i * 5
                  const isSelected = min === minute
                  return (
                    <button
                      key={`min-${min}`}
                      type="button"
                      onClick={() => setMinute(min)}
                      className={`absolute w-10 h-10 text-xs font-bold rounded-full transition-all z-20 flex items-center justify-center
                        ${isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-white hover:text-blue-600'}
                      `}
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                    >
                      {min.toString().padStart(2, '0')}
                    </button>
                  )
              }
              const isSelected = num === hour
              return (
                <button
                  key={`hour-${num}`}
                  type="button"
                  onClick={() => { setHour(num); setMode('minute'); }}
                  className={`absolute w-10 h-10 text-sm font-bold rounded-full transition-all z-20 flex items-center justify-center
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-slate-600 hover:bg-white hover:text-blue-600'}
                  `}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                >
                  {num}
                </button>
              )
            })}

          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex items-center gap-3">
             <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-2xl hover:bg-slate-200 transition-all"
             >
                Cancelar
             </button>
             <button 
              type="button"
              onClick={handleConfirm}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
             >
                <FiCheck size={16} />
                CONFIRMAR
             </button>
          </div>

        </div>
      )}
    </div>
  )
}

