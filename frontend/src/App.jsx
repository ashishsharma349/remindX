import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import AppointmentForm from './pages/AppointmentForm'
import Dashboard from './pages/Dashboard'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-[1200px] mx-auto p-8 font-sans">
        {/* Top Navigation */}
        <nav className="flex justify-between items-center bg-white/10 backdrop-blur-md px-8 py-4 rounded-[var(--radius-card)] mb-8 border border-white/20">
          <div className="flex items-center gap-2 text-white font-bold text-2xl">
            {/* Simple logo icon */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary-blue text-sm">RX</span>
            </div>
            RemindX
          </div>
          
          <div className="flex gap-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `px-6 py-2 rounded-[var(--radius-input)] font-semibold transition-all duration-300 ${isActive ? 'bg-white text-primary-blue' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
              }
            >
              Book Appointment
            </NavLink>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => 
                `px-6 py-2 rounded-[var(--radius-input)] font-semibold transition-all duration-300 ${isActive ? 'bg-white text-primary-blue' : 'text-white/80 hover:bg-white/20 hover:text-white'}`
              }
            >
              Dashboard
            </NavLink>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Routes>
            <Route path="/" element={<AppointmentForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
